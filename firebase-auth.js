// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js"; // Sugiero actualizar a 11.8.1
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js"; // Sugiero actualizar a 11.8.1

// Si no usas Analytics, puedes comentar o eliminar la siguiente línea:
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js"; // Sugiero actualizar a 11.8.1 si lo usas

// --- ¡¡¡ESTA ES LA CONFIGURACIÓN CORRECTA PARA 'maskmood-e3372'!!! ---
const firebaseConfig = {
    apiKey: "AIzaSyBJApVCBPuoZxPAuCAQOIMTebuP0BgJf3Y",  // DEBES USAR ESTE API KEY
    authDomain: "maskmood-e3372.firebaseapp.com",
    projectId: "maskmood-e3372", // <- Debe ser esta
    storageBucket: "maskmood-e3372.firebasestorage.app",
    messagingSenderId: "986585366476",
    appId: "1:986585366476:web:e0fbfa0ea0b1cccfb76769", // <- Debe ser esta
    measurementId: "G-YVBP9MW7E1" // <- Debe ser esta
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Si usas Analytics, descomenta la siguiente línea:
const analytics = getAnalytics(app); // Ahora la línea de getAnalytics está activa con 11.8.1
// ... el resto de tu código es igual de aquí en adelante ...


// --- Funciones para el modal personalizado ---
const customAlertModal = document.getElementById("custom-alert-modal");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertIcon = document.getElementById("alert-icon");
const alertOkButton = document.getElementById("alert-ok-button");
const closeButton = document.querySelector(".close-button");

// Función para mostrar el modal personalizado
function showAlert(title, message, type = "info") {
    // Verificar si los elementos del modal existen
    if (!customAlertModal || !alertTitle || !alertMessage || !alertIcon || !alertOkButton || !closeButton) {
        console.error("Error: Algunos elementos del modal no se encontraron en el DOM. Usando alert() de respaldo.");
        alert(`${title}\n${message}`); // Alerta de respaldo si el modal no se carga
        return;
    }

    alertTitle.textContent = title;
    alertMessage.textContent = message;
    // Limpia todas las clases de tipo antes de añadir una nueva
    alertIcon.classList.remove("success", "error", "info");
    alertIcon.classList.add(type); // Añade la clase de tipo para el icono

    customAlertModal.classList.add("active"); // Mostrar el modal añadiendo la clase 'active'

    // Limpiar eventos para evitar duplicados si la función es llamada varias veces
    alertOkButton.onclick = null;
    closeButton.onclick = null;
    customAlertModal.onclick = null;

    // Cerrar modal al hacer clic en OK
    alertOkButton.onclick = (event) => {
        event.stopPropagation(); // Evita que el clic se propague al fondo del modal
        customAlertModal.classList.remove("active");
    };

    // Cerrar modal al hacer clic en la X
    closeButton.onclick = (event) => {
        event.stopPropagation(); // Evita que el clic se propague al fondo del modal
        customAlertModal.classList.remove("active");
    };

    // Cerrar modal al hacer clic fuera del contenido del modal
    customAlertModal.onclick = (event) => {
        // Solo cerrar si el clic fue directamente en el fondo del modal, no en su contenido
        if (event.target === customAlertModal) {
            customAlertModal.classList.remove("active");
        }
    };
}
// ---------------------------------------------


document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-google");
    const loginButtonText = loginButton ? loginButton.querySelector('.login-text') : null;
    const cancelPurchaseBtn = document.getElementById("cancel-purchase-btn");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector("nav");
    const navLinks = document.querySelectorAll("nav ul li a");

    // Verificaciones de existencia de elementos para depuración
    if (!loginButton) console.error("ERROR: El botón con ID 'login-google' no se encontró en el DOM.");
    if (!cancelPurchaseBtn) console.error("ERROR: El botón con ID 'cancel-purchase-btn' no se encontró en el DOM.");
    if (!hamburgerMenu) console.error("ERROR: El botón con clase 'hamburger-menu' no se encontró en el DOM.");
    if (!navMenu) console.error("ERROR: El elemento 'nav' no se encontró en el DOM.");
    if (navLinks.length === 0) console.warn("ADVERTENCIA: No se encontraron enlaces de navegación dentro de 'nav ul li a'.");


    // Función para actualizar el texto del botón de Google (solo si el span existe)
    function updateGoogleButtonText(isLoggedIn) {
        if (loginButtonText) {
            loginButtonText.textContent = isLoggedIn ? "Cerrar sesión" : "iniciar sesión";
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Usuario autenticado:", user.displayName || user.email);
            if (loginButton) {
                updateGoogleButtonText(true); // Actualiza el texto a "Cerrar sesión"
                loginButton.classList.add("logout");
            }
        } else {
            console.log("Usuario no autenticado.");
            if (loginButton) {
                updateGoogleButtonText(false); // Actualiza el texto a "Iniciar sesión"
                loginButton.classList.remove("logout");
            }
        }
    });

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            const user = auth.currentUser;
            if (user) {
                signOut(auth).then(() => {
                    showAlert("¡Sesión Cerrada!", "Has cerrado sesión correctamente. ¡Vuelve pronto!", "info");
                }).catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                    showAlert("Error", "Hubo un problema al cerrar sesión. Inténtalo de nuevo.", "error");
                });
            } else {
                signInWithPopup(auth, provider)
                    .then((result) => {
                        console.log("Usuario autenticado:", result.user);
                        showAlert("¡Bienvenido!", `Hola, ${result.user.displayName || result.user.email}! Tu piel te lo agradecerá.`, "success");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Error en autenticación:", errorCode, errorMessage);
                        if (errorCode === 'auth/popup-closed-by-user') {
                            showAlert("Cancelado", "El inicio de sesión fue cancelado por el usuario.", "info");
                        } else if (errorCode === 'auth/cancelled-popup-request') {
                            showAlert("Error de ventana emergente", "Ya hay una ventana de inicio de sesión abierta o fue bloqueada.", "error");
                        } else {
                            showAlert("Error de Autenticación", `No pudimos iniciar sesión: ${errorMessage}.`, "error");
                        }
                    });
            }
        });
    }

    // --- Funcionalidad del Carrito ---
    let cartItemCount = 0;
    const cartItemCountElement = document.getElementById("cart-item-count");
    const productGrid = document.querySelector(".product-grid");

    // Función para actualizar la visibilidad del botón de cancelar
    function updateCancelButtonVisibility() {
        if (cancelPurchaseBtn) {
            if (cartItemCount > 0) {
                cancelPurchaseBtn.classList.remove("hidden");
            } else {
                cancelPurchaseBtn.classList.add("hidden");
            }
        }
    }

    // Inicializar la visibilidad del botón al cargar la página
    updateCancelButtonVisibility();

    if (!cartItemCountElement) {
        console.error("ERROR: El elemento con ID 'cart-item-count' no se encontró en el DOM.");
    }

    // Delegación de eventos para los botones "Añadir al Carrito"
    if (productGrid) {
        productGrid.addEventListener("click", (event) => {
            if (event.target.classList.contains("add-to-cart-btn")) {
                cartItemCount++;
                if (cartItemCountElement) {
                    cartItemCountElement.textContent = `(${cartItemCount})`;
                }
                showAlert("¡Producto Añadido!", "Tu MoodMask ha sido añadido al carrito.", "success");
                updateCancelButtonVisibility();
            }
        });
    } else {
        console.error("ERROR: El elemento con clase 'product-grid' no se encontró en el DOM.");
    }

    // Event listener para el botón "Cancelar Compra"
    if (cancelPurchaseBtn) {
        cancelPurchaseBtn.addEventListener("click", () => {
            if (cartItemCount > 0) {
                cartItemCount = 0;
                if (cartItemCountElement) {
                    cartItemCountElement.textContent = `(${cartItemCount})`;
                }
                showAlert("¡Compra Cancelada!", "El carrito ha sido vaciado.", "info");
                updateCancelButtonVisibility();
            } else {
                showAlert("Carrito Vacío", "No hay productos en el carrito para cancelar.", "info");
            }
        });
    }

    // --- Funcionalidad del Menú de Hamburguesa ---
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener("click", () => {
            hamburgerMenu.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Cerrar el menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburgerMenu.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
});
const cartItemCountElement = document.getElementById("cart-item-count");
// --- Redirección a WhatsApp al hacer clic en el carrito ---
const cartIcon = document.querySelector(".cart-icon");

// Tu número de WhatsApp en formato internacional
const whatsappNumber = "51991608720"; // ← cámbialo por tu número real

if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        const mensaje = encodeURIComponent(
            "¡Hola! Estoy interesadx en comprar mis MoodMasks. ¿Podrías brindarme más información?"
        );
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensaje}`;
        window.open(whatsappURL, "_blank");
    });
}
// --- Funcionalidad del Formulario de Suscripción ---
const newsletterForm = document.querySelector("#novedades form");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const emailInput = newsletterForm.querySelector("input[type='email']");
        const email = emailInput.value.trim();

        if (email) {
            showAlert(
                "¡Gracias por unirte!",
                "Te estaremos enviando correos con nuevas promociones y novedades 🌸",
                "success"
            );
            emailInput.value = ""; // Limpia el campo después de enviar
        } else {
            showAlert(
                "Correo inválido",
                "Por favor, ingresa un correo electrónico válido.",
                "error"
            );
        }
    });
}
