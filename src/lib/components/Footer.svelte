<script lang="ts">
    import { PUBLIC_ADMIN_EMAIL } from "$env/static/public";
</script>

<footer class="bg-white/60 backdrop-blur-sm mt-6">
    <div class="mx-auto py-4 text-center">
        <p class="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} KartichkaQR. Всички права запазени.
        </p>
        <p class="text-xs text-slate-500 mt-1">
            Контакт: <a href="mailto:{PUBLIC_ADMIN_EMAIL}" class="underline"
                >{PUBLIC_ADMIN_EMAIL}</a
            >
        </p>
    </div>
</footer>
