async function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    const section_default = [
        {
            "section": 1,
            "startTime": "08:00",
            "endTime": "08:45"
        },
        {
            "section": 2,
            "startTime": "08:55",
            "endTime": "09:40"
        },
        {
            "section": 3,
            "startTime": "10:10",
            "endTime": "10:55"
        },
        {
            "section": 4,
            "startTime": "11:05",
            "endTime": "11:50"
        },
        {
            "section": 5,
            "startTime": "14:00",
            "endTime": "14:45"
        },
        {
            "section": 6,
            "startTime": "14:50",
            "endTime": "15:35"
        },
        {
            "section": 7,
            "startTime": "15:55",
            "endTime": "16:40"
        },
        {
            "section": 8,
            "startTime": "16:45",
            "endTime": "17:30"
        },
        {
            "section": 9,
            "startTime": "18:30",
            "endTime": "19:15"
        },
        {
            "section": 10,
            "startTime": "19:20",
            "endTime": "20:05"
        },
        {
            "section": 11,
            "startTime": "20:10",
            "endTime": "20:55"
        }
    ]
    const section_baima = [
        {
            "section": 1,
            "startTime": "08:30",
            "endTime": "09:15"
        },
        {
            "section": 2,
            "startTime": "09:20",
            "endTime": "10:05"
        },
        {
            "section": 3,
            "startTime": "10:25",
            "endTime": "11:10"
        },
        {
            "section": 4,
            "startTime": "11:15",
            "endTime": "12:00"
        },
        {
            "section": 5,
            "startTime": "13:30",
            "endTime": "14:15"
        },
        {
            "section": 6,
            "startTime": "14:20",
            "endTime": "15:05"
        },
        {
            "section": 7,
            "startTime": "15:25",
            "endTime": "16:10"
        },
        {
            "section": 8,
            "startTime": "16:15",
            "endTime": "17:00"
        },
        {
            "section": 9,
            "startTime": "18:00",
            "endTime": "18:45"
        },
        {
            "section": 10,
            "startTime": "18:50",
            "endTime": "19:35"
        },
        {
            "section": 11,
            "startTime": "19:40",
            "endTime": "20:25"
        }
    ]
    let section = undefined;
    await loadTool('AIScheduleTools')
    let baima = false;
    if (window.provider_result.includes('白马')) {
        baima = true;
    }
    const userInput = await AISchedulePrompt({
        titleText: '请选择你的校区', // 标题内容，字体比较大，超过10个字不给显示的喔，也可以不传就不显示
        tipText: '如果你的校区为新庄/淮安校区，请输入1\n如果你的校区为白马校区，请输入2\n' + '当前自动识别为：' + (baima ? '白马校区' : '新庄/淮安校区'),
        defaultText: baima ? '2' : '1',
        validator: value => { // 校验函数，如果结果不符预期就返回字符串，会显示在屏幕上，符合就返回false
            console.log(value)
            if (value != '1' && value != '2') return '你只能输入1或2'
            return false
        }
    })
    if (userInput == '1') {
        section = section_default
    }
    else {
        section = section_baima
    }

    const resp = await (await fetch('http://jwsjd.njfu.edu.cn/njwhd/student/curriculum?week=1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Token': sessionStorage.getItem('Token')
        }
    })).json();
    const startString = resp['data'][0]['date'][0]['mxrq'];
    const startDate = new Date(startString);
    const startSemester = String(startDate.getTime());
    // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
    return {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: startSemester, // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 3, // 晚间课程节数：[0, 10]之间的整数
        sections: section, // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }
}