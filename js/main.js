'use strict';

const rootNode = document.querySelector(`#main`);
const KeyName = {
  LEFT_ARROW: `ArrowLeft`,
  RIGHT_ARROW: `ArrowRight`
};
const orderScreenById = [
  `intro`,
  `greeting`,
  `rules`,
  `game-1`,
  `game-2`,
  `game-3`,
  `stats`,
];
const arrowsHTML = `
      <div class="arrows__wrap">
        <style>
          .arrows__wrap {
            position: absolute;
            top: 95px;
            left: 50%;
            margin-left: -56px;
          }
          .arrows__btn {
            background: none;
            border: 2px solid black;
            padding: 5px 20px;
          }
        </style>
        <button class="arrows__btn"><-</button>
        <button class="arrows__btn">-></button>
      </div>`;
let buttonsArrowsNodes;
let currentScreenId;
let screensNodes;

let embedNode = function (nodeWhere, nodeWhat) {
  nodeWhere.appendChild(nodeWhat);
};

/** Получает узлы шаблонов всех экранов для отрисовки
  * @return {Array}
  */
let getScreensNodes = function () {
  let nodes = [];
  orderScreenById.forEach((id) => {
    let templateNode = document.querySelector(`#${id}`).content.querySelector(`div`);
    nodes.push(templateNode.cloneNode(true));
  });
  return nodes;
};

let getButtonsArrows = function () {
  return document.querySelectorAll(`.arrows__btn`);
};

/** Проверяет, возможно ли следующее переключение на другой экран
  * @param {Number} code Код нажатой при переключении кнопки
  * @return {Boolean}
  */
let isNextScreenPossible = function (code) {
  return code === KeyName.LEFT_ARROW ? currentScreenId - 1 >= 0 : currentScreenId + 1 <= screensNodes.length - 1;
};

let changeScreen = function (keyName) {
  if (!isNextScreenPossible(keyName)) {
    return;
  }
  if (keyName === KeyName.LEFT_ARROW) {
    setScreenById(currentScreenId - 1);
    return;
  }
  setScreenById(currentScreenId + 1);
};

let getButtonArrowKeyName = function (evt) {
  let node = evt.target;
  if (node.localName !== `button`) {
    return undefined;
  }
  return node === buttonsArrowsNodes[0] ? KeyName.LEFT_ARROW : KeyName.RIGHT_ARROW;
};

let onPress = function (evt) {
  evt.preventDefault();
  let match = Object.keys(KeyName).some((name) => {
    return KeyName[name] === evt.key;
  });
  if (match) {
    changeScreen(evt.key);
  }
};
let onCLick = function (evt) {
  evt.preventDefault();
  let keyName = getButtonArrowKeyName(evt);
  if (keyName !== undefined) {
    changeScreen(keyName);
  }
};

/** Удаляет текущий экран
  */
let removeScreen = function () {
  rootNode.innerHTML = ``;
};

/** Отрисовывает экран
  * @param {Number} id Индекс экрана в массиве
  */
let renderScreen = function (id) {
  embedNode(rootNode, screensNodes[id]);
};

/** Обновляет экран
  * @param {Number} id Индекс очередного экрана для отображения
  */
let updateScreenById = function (id) {
  removeScreen();
  renderScreen(id);
};

let setScreenById = function (id) {
  currentScreenId = id;
  updateScreenById(id);
};

/** Отрисовывает стрелки переключения на экран
  */
let renderArrow = function () {
  const arrowsNode = document.createElement(`div`);
  arrowsNode.innerHTML = arrowsHTML;
  document.body.appendChild(arrowsNode);
};

/** Устанавливает страницу в начальное состояние
  */
let initializePage = function () {
  screensNodes = getScreensNodes();
  setScreenById(0);
  renderArrow();
  buttonsArrowsNodes = getButtonsArrows();
  document.querySelector(`.arrows__wrap`).addEventListener(`click`, onCLick);
  document.addEventListener(`keydown`, onPress);
};

initializePage();

