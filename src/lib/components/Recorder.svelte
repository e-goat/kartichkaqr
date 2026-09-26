<script lang="ts">
    import { onMount, tick } from "svelte";
    import { toast } from "svelte-sonner";
    import MicIcon from "@lucide/svelte/icons/mic";
    import SquareIcon from "@lucide/svelte/icons/square";
    import CheckIcon from "@lucide/svelte/icons/check";
    import PlayIcon from "@lucide/svelte/icons/play";
    import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
    import { Button } from "$lib/components/ui/button";
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
    let stream: MediaStream | null = null;
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
                            toast.error(
                                "Възникна грешка при възпроизвеждането на звука.",
                            );
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
                    toast.error(
                        "Възникна грешка при възпроизвеждането на звука.",
                    );
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

    const startRecord = async (event: Event) => {
        event?.preventDefault();
        rs.blob = null;
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrl = null;
        }
        audioElement = null;
        isPlaying = false;

        try {
            await setupStream();
        } catch (err) {
            toast.error(`Възникна грешка при записването на звука: ${err}`);
            return;
        }
        mediaRecorder.start();
        recording = true;
    };

    const handleStartStop = async (event: Event) => {
        event?.preventDefault();

        if (recording) {
            rs.finalTimeLeft = timeLeft;
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            recording = false;
            isRecordingComplete = true;
        } else if (!hasStarted) {
            await startRecord(event);
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
        const ext =
            (rs.blob.type.split("/")[1] ?? "webm").split(";")[0] || "webm";
        const file = new File([rs.blob], cs.cardUuid.trim() + "." + ext, {
            type: rs.blob.type,
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        blobInput.files = dataTransfer.files;
        form.appendChild(blobInput);
    }

    async function setupStream() {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream = s;

        const options: MediaRecorderOptions = {};
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            options.mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
            options.mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
            options.mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
            options.mimeType = "audio/ogg;codecs=opus";
        }

        mediaRecorder = new MediaRecorder(s, options);
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

                const form = document.getElementById(
                    "step-form",
                ) as HTMLFormElement;
                const existingBlob = form.querySelector('input[name="record"]');
                if (existingBlob) {
                    existingBlob.remove();
                }

                const blobInput = document.createElement("input");
                blobInput.type = "file";
                blobInput.name = "record";
                blobInput.style.display = "none";

                const blobExt =
                    (rs.blob.type.split("/")[1] ?? "webm").split(";")[0] ||
                    "webm";
                const file = new File(
                    [rs.blob],
                    cs.cardUuid.trim() + "." + blobExt,
                    { type: rs.blob.type },
                );
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                blobInput.files = dataTransfer.files;

                form.appendChild(blobInput);
            }

            // Release the microphone
            s.getTracks().forEach((t) => t.stop());
            stream = null;
        };
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
    });
</script>

<div class="flex justify-center items-center flex-col gap-6">
    <div class="relative">
        <svg class="size-32 -rotate-90" viewBox="0 0 120 120">
            <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-muted"
            />
            {#if hasStarted}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    class:text-destructive={isActive}
                    class:text-primary={isRecordingComplete}
                    stroke-dasharray="339.292"
                    stroke-dashoffset={339.292 -
                        (progressPercentage / 100) * 339.292}
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.3s ease"
                />
            {/if}
        </svg>

        <button
            type="button"
            class="absolute inset-0 m-2 flex size-28 items-center justify-center rounded-full border-4 border-primary/60 bg-primary/10 text-destructive transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary/10"
            aria-label={isActive
                ? "Спри записа"
                : isRecordingComplete
                  ? "Записът е завършен"
                  : "Започни запис"}
            disabled={isRecordingComplete}
            onclick={handleStartStop}
        >
            {#if isActive}
                <SquareIcon class="size-8 fill-current" />
            {:else if !isRecordingComplete}
                <MicIcon class="size-9" />
            {:else}
                <CheckIcon class="size-9 text-primary" />
            {/if}
        </button>
    </div>

    <div class="flex flex-col items-center gap-2">
        <div
            class="text-2xl font-bold tabular-nums"
            class:text-destructive={isActive}
            class:text-primary={isRecordingComplete}
            class:text-muted-foreground={!hasStarted}
        >
            {formatTime(timeLeft)}
        </div>

        {#if isActive}
            <div class="text-sm text-muted-foreground flex items-center gap-2">
                <div
                    class="size-2 bg-destructive rounded-full animate-pulse"
                ></div>
                Записване...
            </div>
        {:else if isRecordingComplete}
            <div class="text-sm text-muted-foreground flex items-center gap-2">
                <div class="size-2 bg-primary rounded-full"></div>
                Записът е завършен
            </div>
        {:else}
            <div class="text-sm text-muted-foreground text-center">
                Натиснете за започване на запис<br />
                <span class="text-xs">
                    Максимално време за запис: {MAX_TIME} секунди</span
                >
            </div>
        {/if}
    </div>

    {#if isRecordingComplete}
        <div class="flex justify-center items-center gap-2">
            <Button type="button" variant="outline" onclick={handleReset}>
                <RotateCcwIcon /> Отначало
            </Button>
            <Button
                type="button"
                variant={isPlaying ? "destructive" : "secondary"}
                disabled={!(rs.blob && audioUrl)}
                onclick={handleMediaRecording}
            >
                {#if isPlaying}
                    <SquareIcon /> Спри
                {:else}
                    <PlayIcon /> Пусни
                {/if}
            </Button>
        </div>
    {/if}
</div>
