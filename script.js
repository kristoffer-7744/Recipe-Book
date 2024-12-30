
document.addEventListener("DOMContentLoaded", function () {
    const mainDiv = document.getElementById("container");
    const form = document.getElementById("recipe-form");
    const recipesContainer = document.getElementById("recipes");
    const searchBar = document.getElementById("search-bar");
    const defaultImg = "yummy.jpg"
    const h2 = document.getElementById("imgH2");
    const img = document.getElementById("img");
    const resetBtn = document.getElementById("reset");
    const label = document.getElementById("lbl");

    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    //display recipe 
    function displayRecipes(filteredRecipes = recipes){
        recipesContainer.innerHTML="";

        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            
            const recipeImg = document.createElement("img");
            recipeImg.src = recipe.recipeImage;
            recipeCard.appendChild(recipeImg);

            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.name;
            recipeCard.appendChild(recipeTitle);

            const recipeIngredients = document.createElement("p");
            recipeIngredients.textContent= `INGREDIENTS : ${recipe.ingredients}`;
            recipeCard.appendChild(recipeIngredients);

            const recipeInstructions = document.createElement("p");
            recipeInstructions.textContent = `INSTRUCTIONS : ${recipe.instructions}`;
            recipeCard.appendChild(recipeInstructions);
            
            const conformDel = document.createElement("div");
            conformDel.setAttribute("style",
                "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5)"
            );
            conformDel.setAttribute("id", "conformDel");
            mainDiv.appendChild(conformDel);

            const div = document.createElement("div");
            div.setAttribute("style",
                "margin: 100px auto; padding: 20px; width: 300px; background: white; border-radius: 8px; text-align: center"
            );
            conformDel.appendChild(div);

            const para = document.createElement("p");
            para.innerText="Are you sure? Delete the recipe!!!";
            div.appendChild(para);

            const yesBtn = document.createElement("button");
            yesBtn.innerText = "Yes";
            yesBtn.id = "yesBtn";
            div.appendChild(yesBtn);

            const noBtn = document.createElement("button"); 
            noBtn.innerText = "No";
            noBtn.id = "noBtn";
            div.appendChild(noBtn);

            const deleteRecipe = document.createElement("button");
            deleteRecipe.classList.add("delBtn");
            deleteRecipe.innerText="Delete";
            deleteRecipe.addEventListener("click", () => {
                conformDel.style.display="block";
            });

            yesBtn.addEventListener("click", () => {
                recipes = recipes.filter((r) => r.name !== recipe.name);
                localStorage.setItem("recipes", JSON.stringify(recipes)); 
                displayRecipes();
                conformDel.style.display="none";
            });

            noBtn.addEventListener("click", () => {
                conformDel.style.display="none";
            });
            recipeCard.appendChild(deleteRecipe);
            recipesContainer.appendChild(recipeCard);
        });
    };

    //checking is image selected or not
    img.addEventListener("change", () => {
        if (img.files && img.files[0]) {
            h2.innerText = "! Image Selected !";
            h2.style.color = "white";
            label.style.backgroundColor = "#28a745";
        } 
    });

    //getting form values and adding to the recipes array
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const recipeName = document.getElementById("recipe-name").value;
        const ingredients = document.getElementById("ingredients").value;
        const instructions = document.getElementById("instructions").value;
        const image = document.getElementById("img").files[0];
        const newRecipe = {
            name : recipeName,
            ingredients : ingredients,
            instructions : instructions,
            recipeImage : null,
        };

        if(image){
            const reader = new FileReader();
            reader.onload = function (e) {
                newRecipe.recipeImage = e.target.result;
                recipes.push(newRecipe);
                localStorage.setItem("recipes", JSON.stringify(recipes));
                displayRecipes();
            };
            reader.readAsDataURL(image);
        } else {
            newRecipe.recipeImage = defaultImg;
            recipes.push(newRecipe);
            localStorage.setItem("recipes", JSON.stringify(recipes));
            displayRecipes();
        }
        form.reset();
        h2.innerText = "Upload Recipe Image";
        img.value = "";
        label.style.backgroundColor = "white";
        h2.style.color = "black";
    });

    //searching recipes using recipe name or ingradients
    searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.toLowerCase().includes(query)
        );  
        displayRecipes(filteredRecipes);
    });

    //text changing behaviour.
    const message = [
        "! Welcome to the Recipe Book !",
        "! Explore Delicious Recipes !",
        "! Add Your Favorite Dishes !",
        "! Search for New Ideas !"
    ];

    let currentIdx = 0;

    function changeText() {
        const textElement = document.getElementById("changing-text");
        textElement.style.opacity = 0;
        setTimeout(() => {
            currentIdx = (currentIdx + 1) % message.length;
            textElement.textContent = message[currentIdx];
            textElement.style.opacity = 1;
        },500);
    }

    setInterval(changeText,2000);
     
    // fisrt calling funtion
    displayRecipes();
});