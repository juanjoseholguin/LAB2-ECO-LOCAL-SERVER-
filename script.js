const API_URL = "http://localhost:3004/posts";
const postsList = document.getElementById("publicationsList");
const form = document.getElementById("publicationForm");

async function loadPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        
        postsList.innerHTML = "";
        
        if (posts.length === 0) {
            postsList.innerHTML = `
                <div class="publication-card">
                    <p style="text-align: center; color: #666;">
                        No hay posts aún :C
                    </p>
                </div>
            `;
            return;
        }
        
        posts.forEach(post => {
            const div = document.createElement("div");
            div.className = "publication-card";
            
            let imageHtml = "";
            if (post.imageUrl && post.imageUrl.trim() !== "") {
                imageHtml = `
                    <div class="publication-image">
                        <img src="${post.imageUrl}" alt="Imagen" onerror="this.style.display='none'">
                    </div>
                `;
            }
            
            div.innerHTML = `
                <h3 class="publication-title">${post.title}</h3>
                <p class="publication-description">${post.description}</p>
                ${imageHtml}
                <div class="publication-actions">
                    <button class="btn btn-danger" onclick="deletePost(${post.id})">
                        DELETE
                    </button>
                </div>
            `;
            
            postsList.appendChild(div);
        });
    } catch (error) {
        console.error("Error cargando posts:", error);
        showMessage("Error al cargar los posts", "error");
    }
}

async function deletePost(id) {
    try {
        await fetch(`${API_URL}/${id}`, { 
            method: "DELETE" 
        });
        
        showMessage("Post eliminado!", "success");
        loadPosts();
    } catch (error) {
        console.error("Error eliminando post:", error);
        showMessage("Error al eliminar el post", "error");
    }
}

async function createPost(postData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        showMessage("Post creado!", "success");
        form.reset();
        loadPosts();
    } catch (error) {
        console.error("Error creando post:", error);
        showMessage("Error al crear el post", "error");
    }
}

function showMessage(message, type = "info") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `notification ${type}`;

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

    const newPost = {
        title: title,
        description: description,
        imageUrl: imageUrl || null
    };

    await createPost(newPost);
});

loadPosts();
