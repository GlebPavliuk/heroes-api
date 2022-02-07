const heroesAPI = "https://61c9d37520ac1c0017ed8eac.mockapi.io/heroes";
const myForm = document.getElementById("heroesForm");

let heroes = [];
const controller = async (url, method = "GET", obj) => {
  let options = {
    method: method,
    headers: {
      "Content-type": "application/json",
    },
  };

  if (obj) options.body = JSON.stringify(obj);

  let request = await fetch(url, options);

  if (request.ok) {
    return request.json();
  } else {
    throw new Error(request.statusText);
  }
};

myForm.addEventListener("submit", async (e) => {
  const inputHeroNameValue = myForm.querySelector(`input[data-name="heroName"]`).value;
  const isHeroExist = heroes.some((el) => el.name.toLowerCase() == inputHeroNameValue.toLowerCase());

  e.preventDefault();

  if (isHeroExist) {
    console.log("Hero exist");
  } else {
    await controller(`${heroesAPI}`, "POST", {
      name: inputHeroNameValue,
      comics: document.querySelectorAll("select")[0].value,
      favourite: document.querySelectorAll("input")[1].checked,
    }).then((response) => viewHero(response));
  }
});

const viewHero = (hero) => {
  const tBody = document.querySelector("tbody");
  const myNewTr = document.createElement("tr");
  const myLabelTd = document.createElement("td");
  const myDeleteBtnTd = document.createElement("td");
  const myNewLabel = document.createElement("label");
  const myNewInput = document.createElement("input");
  const deleteBtn = document.createElement("button");

  myNewTr.innerHTML = `<td>${hero.name}</td><td>${hero.comics}</td>`;
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add(hero.id);
  myDeleteBtnTd.appendChild(deleteBtn);
  myNewLabel.classList.add("heroFavouriteInput");
  myNewLabel.innerText = "Favourite: ";
  myNewInput.type = "checkbox";
  myNewLabel.appendChild(myNewInput);
  myNewInput.checked = hero.favourite;
  myLabelTd.appendChild(myNewLabel);
  myNewTr.appendChild(myLabelTd);

  myNewInput.addEventListener(`change`, async () => {
    let heroFav = await controller(`${heroesAPI}/${hero.id}`, `PUT`, { favourite: !hero.favourite });
  });

  deleteBtn.addEventListener("click", async () => {
    await controller(`${heroesAPI}/${deleteBtn.classList[0]}`, "DELETE");
    tBody.removeChild(myNewTr);
  });

  myNewTr.appendChild(myDeleteBtnTd);
  tBody.appendChild(myNewTr);
};

(async () =>
  await controller(`${heroesAPI}`).then((respose) => {
    heroes = respose;
    respose.map((hero) => viewHero(hero));
  }))();
