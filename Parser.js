function splitAndConvertToNumbers(str) {
    let length = str.length;
    let result = [];

    for (let i = 0; i < length; i += 2) {
        let substr = str.slice(i, i + 2);
        result.push(Number(substr));
    }

    return result;
}

function scheduleHtmlParser(last_step) {
    let courses = JSON.parse(last_step)['result'];
    let result = [];
    
    for (let course of courses) {
        course['classTime'] = String(course['classTime']);
        result.push({
            name: course['courseName'],
            position: course['location'],
            teacher: course['teacherName'],
            weeks: course['classWeekDetails'].split(',').map(x => { if (!!x) return parseInt(x) }).filter(x => !!x),
            day: parseInt(course['classTime'].charAt(0)),
            sections: splitAndConvertToNumbers(course['classTime'].slice(1))
        })
    }
    return result
}