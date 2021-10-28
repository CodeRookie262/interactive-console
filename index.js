// 用例执行
import Game from './src/index.js'
const game = new Game
// game.log('777', {color: 'red'})
// game.tranformTemplate('${nickName}，你好呀，欢迎来到 ${area}', {
//     nickName: 'QWZ',
//     area: 'China'
// })
game.setConfig('delimiters', ['{{', '}}'])
game
    .registTemp('Greetings', '{nickName}}，你好呀，欢迎来到 {{area}}')
    .fillTemp('Greetings', {
        nickName: 'QWZ',
        area: 'China'
    }, )

console.log('Game Instance:', game)