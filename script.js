const API_URL = "http://localhost:43004/publications";
const publicationsList = document.getElementById("publicationsList");
const form = document.getElementById("publicationForm");

async function loadPublications() {
    try {
        const response = await fetch(API_URL);
        const publications = await response.json();
        
        publicationsList.innerHTML = "";
        
        if (publications.length === 0) {
            publicationsList.innerHTML = `
                <div class="publication-card">
                    <p style="text-align: center; color: #666;">
                        No hay publicaciones aún :C
                    </p>
                </div>
            `;
            return;
        }
        
        publications.forEach(publication => {
            const div = document.createElement("div");
            div.className = "publication-card";
            
            let imageHtml = "";
            if (publication.imageUrl && publication.imageUrl.trim() !== "") {
                imageHtml = `
                    <div class="publication-image">
                        <img src="${publication.imageUrl}" alt="Imagen" onerror="this.style.display='none'">
                    </div>
                `;
            }
            
            div.innerHTML = `
                <h3 class="publication-title">${publication.title}</h3>
                <p class="publication-description">${publication.description}</p>
                ${imageHtml}
                <div class="publication-actions">
                    <button class="btn btn-danger" onclick="deletePublication(${publication.id})">
                        Eliminar
                    </button>
                </div>
            `;
            
            publicationsList.appendChild(div);
        });
    } catch (error) {
        console.error("Error cargando publicaciones:", error);
        showMessage("Error al cargar las publicaciones", "error");
    }
}

async function deletePublication(id) {
    try {
        await fetch(`${API_URL}/${id}`, { 
            method: "DELETE" 
        });
        
        showMessage("Publicacion eliminada!", "success");
        loadPublications();
    } catch (error) {
        console.error("Error eliminando publicacion:", error);
        showMessage("Error al eliminar la publicacion", "error");
    }
}

async function createPublication(publicationData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(publicationData)
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        showMessage("Publicacion creada!", "success");
        form.reset();
        loadPublications();
    } catch (error) {
        console.error("Error creando publicacion:", error);
        showMessage("Error al crear la publicacion", "error");
    }
}

function showMessage(message, type = "info") {
    const notification = document.createElement("div");
    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "10px 15px";
    notification.style.borderRadius = "5px";
    notification.style.color = "white";
    notification.style.fontWeight = "bold";
    notification.style.zIndex = "1000";
    notification.style.fontSize = "14px";

    if (type === "success") {
        notification.style.background = "#4A90E2";
    } else if (type === "error") {
        notification.style.background = "#FF6347";
    } else if (type === "warning") {
        notification.style.background = "#FFD700";
        notification.style.color = "#333";
    } else {
        notification.style.background = "#87CEEB";
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 2000);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageUrl = document.getElementById("imageUrl").value.trim();

    if (!title || !description) {
        showMessage("Completa todos los campos", "warning");
        return;
    }

    const newPublication = {
        title: title,
        description: description,
        imageUrl: imageUrl || null
    };

    await createPublication(newPublication);
});

loadPublications();
