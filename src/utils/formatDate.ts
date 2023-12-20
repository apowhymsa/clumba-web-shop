export function formatDate(inputString: string) {
    let date = new Date(inputString);

    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
    let year: string | number = date.getFullYear();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();

    // Добавление ведущих нулей при необходимости
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Форматирование строки
    var formattedString = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedString;
}