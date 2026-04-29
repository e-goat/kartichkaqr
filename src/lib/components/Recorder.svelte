<script lang="ts">
    import { onMount, tick } from "svelte";
    import Swal from "sweetalert2";
    import { cs, rs } from "$lib/state.svelte";
    interface Props {
        recording?: boolean;
        clickEvent?: (event: Event) => void;
    }

    let { recording = false, clickEvent = () => {} }: Props = $props();

    const MAX_TIME = 30;
    let timeLeft = $state(MAX_TIME);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let hasStarted = $state(false);
    let isRecordingComplete = $state(false);
    let mediaRecorder: MediaRecorder;
    let audioUrl: string | null = $state(null);
    let audioElement: HTMLAudioElement | null = null;
    let isPlaying = $state(false);

    const progressPercentage = $derived(
        ((MAX_TIME - timeLeft) / MAX_TIME) * 100,
    );

    const isActive = $derived(recording);

    $effect(() => {
        if (recording) {
            if (!hasStarted) {
                timeLeft = MAX_TIME;
                hasStarted = true;
            }
            intervalId = setInterval(() => {
                timeLeft -= 1;
                if (timeLeft <= 0) {
                    rs.finalTimeLeft = 0;
                    if (intervalId) clearInterval(intervalId);
                    if (mediaRecorder && mediaRecorder.state === "recording") {
                        mediaRecorder.stop();
                    }
                    recording = false;
                    isRecordingComplete = true;
                    const event = new Event("timeup");
                    clickEvent(event);
                }
            }, 1000);
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    });

    function handleReset(event: Event) {
        event?.preventDefault();

        hasStarted = false;
        isRecordingComplete = false;
        recording = false;
        timeLeft = MAX_TIME;
        rs.blob = null;
        rs.finalTimeLeft = null;
        cs.audioUrl = null;

        const form = document.getElementById("step-form") as HTMLFormElement;
        const existingBlob = form?.querySelector('input[name="record"]');
        if (existingBlob) {
            existingBlob.remove();
        }

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrl = null;
        }
        isPlaying = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function formatTime(seconds: number): string {
        return `${seconds}s`;
    }

    async function handleMediaRecording(event: Event) {
        event.preventDefault();
        if (rs.blob && audioUrl) {
            if (isPlaying) {
                if (audioElement) {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                }
                isPlaying = false;
            } else {
                try {
                    if (!audioElement) {
                        audioElement = new Audio(audioUrl);
                        audioElement.onended = () => {
                            isPlaying = false;
                        };
                        audioElement.onerror = (error) => {
                            Swal.fire({
                                title: "Грешка!",
                                text: "Възникна грешка при възпроизвеждането на звука.",
                                icon: "error",
                                confirmButtonText: "Разбрано",
                                customClass: {
                                    confirmButton: "swal-confirm-button",
                                },
                                buttonsStyling: false,
                            });
                            isPlaying = false;
                            if (rs.blob) {
                                if (audioUrl) {
                                    URL.revokeObjectURL(audioUrl);
                                }
                                audioUrl = URL.createObjectURL(rs.blob);
                                audioElement = null;
                            }
                        };
                    }

                    await audioElement.play();
                    isPlaying = true;
                } catch (error) {
                    Swal.fire({
                        title: "Грешка!",
                        text: "Възникна грешка при възпроизвеждането на звука.",
                        icon: "error",
                        confirmButtonText: "Разбрано",
                        customClass: {
                            confirmButton: "swal-confirm-button",
                        },
                        buttonsStyling: false,
                    });
                    isPlaying = false;

                    if (rs.blob) {
                        if (audioUrl) {
                            URL.revokeObjectURL(audioUrl);
                        }
                        audioUrl = URL.createObjectURL(rs.blob);
                        audioElement = null;
                    }
                }
            }
        }
    }

    const startRecord = (event: Event, time: number = MAX_TIME) => {
        event?.preventDefault();
        rs.blob = null;
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrl = null;
        }
        audioElement = null;
        isPlaying = false;

        mediaRecorder.start();
        recording = true;
    };

    const handleStartStop = (event: Event) => {
        event?.preventDefault();

        if (recording) {
            rs.finalTimeLeft = timeLeft;
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            recording = false;
            isRecordingComplete = true;
        } else if (!hasStarted) {
            startRecord(event);
        }
    };

    async function reattachBlobToForm() {
        await tick();
        if (!rs.blob) return;
        const form = document.getElementById("step-form") as HTMLFormElement;
        if (!form) return;
        const existing = form.querySelector('input[name="record"]');
        if (existing) existing.remove();
        const blobInput = document.createElement("input");
        blobInput.type = "file";
        blobInput.name = "record";
        blobInput.style.display = "none";
        const file = new File([rs.blob], cs.cardUuid.trim() + ".webm", {
            type: rs.blob.type,
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        blobInput.files = dataTransfer.files;
        form.appendChild(blobInput);
    }

    onMount(async () => {
        // Restore state if a recording already exists from a previous visit to this step
        if (rs.blob) {
            hasStarted = true;
            isRecordingComplete = true;
            timeLeft = rs.finalTimeLeft ?? 0;
            audioUrl = URL.createObjectURL(rs.blob);
            cs.audioUrl = audioUrl;
            await reattachBlobToForm();
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                })
                .then((stream) => {
                    const options: MediaRecorderOptions = {};

                    if (
                        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                    ) {
                        options.mimeType = "audio/webm;codecs=opus";
                    } else if (MediaRecorder.isTypeSupported("audio/webm")) {
                        options.mimeType = "audio/webm";
                    } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
                        options.mimeType = "audio/mp4";
                    } else if (
                        MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
                    ) {
                        options.mimeType = "audio/ogg;codecs=opus";
                    }

                    mediaRecorder = new MediaRecorder(stream, options);

                    let chunks: Blob[] = [];

                    mediaRecorder.ondataavailable = (event: BlobEvent) => {
                        if (event.data && event.data.size > 0) {
                            chunks.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        if (chunks.length > 0) {
                            rs.blob = new Blob(chunks, {
                                type: mediaRecorder.mimeType || "audio/webm",
                            });
                            if (audioUrl) {
                                URL.revokeObjectURL(audioUrl);
                            }
                            audioUrl = URL.createObjectURL(rs.blob);
                            cs.audioUrl = audioUrl;
                            chunks = [];

                            // Add blob to the form for server upload
                            const form = document.getElementById(
                                "step-form",
                            ) as HTMLFormElement;
                            const existingBlob = form.querySelector(
                                'input[name="record"]',
                            );
                            if (existingBlob) {
                                existingBlob.remove();
                            }

                            const blobInput = document.createElement("input");
                            blobInput.type = "file";
                            blobInput.name = "record";
                            blobInput.style.display = "none";

                            const file = new File(
                                [rs.blob],
                                cs.cardUuid.trim() + ".webm",
                                { type: rs.blob.type },
                            );
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            blobInput.files = dataTransfer.files;

                            form.appendChild(blobInput);
                        }
                    };
                })
                .catch((err) => {
                    Swal.fire({
                        title: "Грешка!",
                        text: `Възникна грешка при записването на звука: ${err}`,
                        icon: "error",
                        confirmButtonText: "Разбрано",
                        customClass: {
                            confirmButton: "swal-confirm-button",
                        },
                        buttonsStyling: false,
                    });
                });
        } else {
            Swal.fire({
                title: "Грешка!",
                text: "Записът на звука не е поддържан в вашия браузър!",
                icon: "error",
                confirmButtonText: "Разбрано",
                customClass: {
                    confirmButton: "swal-confirm-button",
                },
                buttonsStyling: false,
            });
        }
    });
</script>

<div class="flex justify-center items-center flex-col gap-6">
    <div class="relative">
        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-gray-200"
            />
            {#if hasStarted}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    class:text-red-500={isActive}
                    class:text-blue-500={isRecordingComplete}
                    stroke-dasharray="339.292"
                    stroke-dashoffset={339.292 -
                        (progressPercentage / 100) * 339.292}
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.3s ease"
                />
            {/if}
        </svg>

        <button
            class="absolute inset-0 flex justify-center items-center border-4 bg-custom-teal-200/30 border-custom-orange-400 rounded-full text-center w-28 h-28 m-2 focus:outline-none focus:ring-4 focus:ring-custom-orange-400/50 hover:bg-custom-teal-200/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-custom-teal-200/30"
            disabled={isRecordingComplete}
            onclick={handleStartStop}
        >
            {#if isActive}
                <span class="absolute">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-red-500"
                    >
                        <rect
                            x="6"
                            y="6"
                            width="12"
                            height="12"
                            fill="currentColor"
                        ></rect>
                    </svg>
                </span>
            {:else if !isRecordingComplete}
                <span class="absolute">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-red-500"
                    >
                        <polygon points="5,3 19,12 5,21" fill="currentColor"
                        ></polygon>
                    </svg>
                </span>
            {:else}
                <span class="absolute">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-gray-400"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12h8"></path>
                    </svg>
                </span>
            {/if}
        </button>
    </div>

    <div class="flex flex-col items-center gap-2">
        <div
            class="text-2xl font-bold tabular-nums"
            class:text-red-500={isActive}
            class:text-blue-500={isRecordingComplete}
            class:text-gray-500={!hasStarted}
        >
            {formatTime(timeLeft)}
        </div>

        {#if isActive}
            <div class="text-sm text-gray-600 flex items-center gap-2">
                <div
                    class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                ></div>
                Записване...
            </div>
        {:else if isRecordingComplete}
            <div class="text-sm text-gray-600 flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                Записът е завършен
            </div>
        {:else}
            <div class="text-sm text-gray-500 text-center">
                Натиснете за започване на запис<br />
                <span class="text-xs text-gray-400">
                    Максимално време за запис: {MAX_TIME} секунди</span
                >
            </div>
        {/if}
    </div>

    {#if isRecordingComplete}
        <div class="flex justify-center items-center gap-2">
            <button
                class="cursor-pointer px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                onclick={handleReset}
            >
                Отначало
            </button>
            {#if rs.blob && audioUrl}
                <button
                    class="cursor-pointer px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
                    class:bg-green-200={!isPlaying}
                    class:hover:bg-green-300={!isPlaying}
                    class:text-green-700={!isPlaying}
                    class:focus:ring-green-400={!isPlaying}
                    class:bg-red-200={isPlaying}
                    class:hover:bg-red-300={isPlaying}
                    class:text-red-700={isPlaying}
                    class:focus:ring-red-400={isPlaying}
                    onclick={handleMediaRecording}
                >
                    {isPlaying ? "Спри" : "Пусни"}
                </button>
            {:else}
                <button
                    class="cursor-not-allowed px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-lg"
                    disabled
                >
                    Пусни
                </button>
            {/if}
        </div>
    {/if}
</div>
