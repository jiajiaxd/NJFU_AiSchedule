function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = '#fff';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontSize = '24px';
    overlay.style.fontWeight = 'bold';
    overlay.style.zIndex = '9999';
    overlay.innerText = '正在导入中...\n若有BUG请发邮件至i@jiajiaxd.com';
    document.body.appendChild(overlay);
}
async function scheduleHtmlProvider() {
    if (!window.pressed_button) {
        window.pressed_button = true;
        showLoadingOverlay();
        let result = [];
        let seenCourses = new Set();
        for (let week = 1; week <= 20; week++) {
            const resp = await fetch('http://jwsjd.njfu.edu.cn/njwhd/student/curriculum?week=' + week, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': sessionStorage.getItem('Token')
                }
            });
            const resp_result = (await resp.json())['data'][0];
            if (resp_result['courses'].length > 0) {
                for (course of resp_result['courses']) {
                    if (!seenCourses.has(course['jx0408id'])) {
                        seenCourses.add(course['jx0408id'])
                        result.push(course);
                    }
                }
            }
        }
        window.provider_result = JSON.stringify({'result': result});
        return window.provider_result;
    }

}