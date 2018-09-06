import AbstractView from './abstract/base';
import getStats from '../template/game/get-stats';
import answers from '../data/answers';
import gameState from '../data/state-of-game';

const QUANTITY_GAMES = 10;

const getTotalScore = (data) => {
  return `<tr>
    <td colspan="5" class="result__total  result__total--final">${Object.keys(data.Score).reduce((acc, key) => {
    acc += data.Score[key];
    return acc;
  }, 0)}</td>
  </tr>`;
};
const getBonusScore = (data) => {
  return `<tr>
          <td></td>
          <td class="result__extra">Бонус за скорость:</td>
          <td class="result__extra">${data.Stat.fast} <span class="stats__result stats__result--fast"></span></td>
          <td class="result__Points">× ${data.Point.fast}</td>
          <td class="result__total">${data.Score.fast}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Бонус за жизни:</td>
          <td class="result__extra">${data.Stat.life} <span class="stats__result stats__result--alive"></span></td>
          <td class="result__Points">× ${data.Point.life}</td>
          <td class="result__total">${data.Score.life}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Штраф за медлительность:</td>
          <td class="result__extra">${data.Stat.slow} <span class="stats__result stats__result--slow"></span></td>
          <td class="result__Points">× ${data.Point.slow}</td>
          <td class="result__total">${data.Score.slow}</td>
        </tr>`;
};
const getGameStatus = (win) => {
  return win ? `WIN!` : `FAIL`;
};
const getAnswerScore = (Score, win) => {
  return win ? Score.correct : `FAIL`;
};
const getGameResult = (data) => {
  if (data.win) {
    return `${getBonusScore(data)} ${getTotalScore(data)}`;
  }
  return ``;
};
const getQuantityCorrectAnswer = (data) => {
  return data.filter((element) => {
    return element === `correct`;
  }).length;
};
const getQuantityFastAnswer = () => {
  return 0;
};
const getQuantitySlowAnswer = () => {
  return 0;
};
const isUserWin = (data) => {
  return data.games === QUANTITY_GAMES;
};

const Point = {
  correct: 100,
  fast: 50,
  slow: -50,
  life: 50
};

export default class StatsView extends AbstractView {
  get template() {
    const win = isUserWin(gameState);
    const Stat = {
      correct: getQuantityCorrectAnswer(answers),
      fast: getQuantityFastAnswer(),
      slow: getQuantitySlowAnswer(),
      life: gameState.life
    };
    const Score = {
      correct: Stat.correct * Point.correct,
      fast: Stat.fast * Point.fast,
      slow: Stat.slow * Point.slow,
      life: Stat.life * Point.life
    };
    return `  
        <header class="header">
            <button class="back">
              <span class="visually-hidden">Вернуться к началу</span>
              <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
                <use xlink:href="img/sprite.svg#arrow-left"></use>
              </svg>
              <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
                <use xlink:href="img/sprite.svg#logo-small"></use>
              </svg>
            </button>
          </header>
          <section class="result">
            <h2 class="result__title">${getGameStatus(win)}</h2>
            <table class="result__table">
              <tr>
                <td class="result__number">1.</td>
                <td colspan="2">
                  ${getStats(answers)}
                </td>
                <td class="result__Points">× 100</td>
                <td class="result__total">${getAnswerScore(Score, win)}</td>
              </tr>
              ${getGameResult({Score, Stat, Point, win})}
            </table>
          </section>`;
  }
  onBack() {}
  bind() {
    this._element.querySelector(`.back`).addEventListener(`click`, this.onBack);
  }
}
