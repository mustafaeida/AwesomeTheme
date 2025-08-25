document.addEventListener("DOMContentLoaded", () => {
    const lightBtn = document.querySelector('[data-kt-theme-mode="light"]');
    const darkBtn  = document.querySelector('[data-kt-theme-mode="dark"]');
    const html     = document.documentElement;

    // افتراضي: light
    html.classList.remove("dark");
    lightBtn.classList.add("hidden");
    darkBtn.classList.remove("hidden");

    // لما يضغط على dark
    darkBtn.addEventListener("click", () => {
        html.classList.add("dark");
        darkBtn.classList.add("hidden");
        lightBtn.classList.remove("hidden");
    });

    // لما يضغط على light
    lightBtn.addEventListener("click", () => {
        html.classList.remove("dark");
        lightBtn.classList.add("hidden");
        darkBtn.classList.remove("hidden");
    });
});
