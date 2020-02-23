export default function (date) {
    let diffTime = new Date().getTimezoneOffset()
    return new Date(Date.parse('2020-02-18 13:33:01') - diffTime * 60 * 1000)
}