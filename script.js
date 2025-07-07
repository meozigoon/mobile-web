const profiles = {
    cho: {
        title: "조영식 Youngsik Cho",
        content: `도쿄이과대학 창역이공학부 전기전자정보공학과 25학번, 2006년생
            IEEE 회원
            C, C++, C#, Python, JavaScript, Java 사용
            PCB 디자인, 펌웨어 개발, 일부 프로젝트 프로그래밍 담당
            학생 대상 프로그래밍 멘토링`,
    },
    lee: {
        title: "이동하 Dongha Lee",
        content: `한성과학고등학교 34기, 2009년생, 
            과학기술정보통신부 장관상 수상, 단대소고 프로그래밍 대회 은상 수상
            C, C++, C#, Python, JavaScript 사용
            프로젝트 코딩 및 펌웨어 개발, 프론트엔드 개발, 일부 PCB 디자인 담당
            BOJ 플레티넘 3 달성`,
    },
    park: {
        title: "박준현 Junhyun Park",
        content: `이화여자대학교사범대학부속이화금란고등학교 68기, 2009년생
            삼성 주니어 SW 창작 대회 공감상 수상
            C, C++, C#, Python, Java 사용
            프로젝트 프로그래밍, 백엔드 개발 담당
            BOJ 플래티넘 5 달성`,
    },
    kim: {
        title: "김주원 Juwon Kim",
        content: `성산중학교 2학년, 2011년생
            C, C++, C# 사용
            펌웨어 개발, 납땜 담당
            BOJ 골드 3 달성`,
    },
};

document.querySelectorAll(".team-grid .member").forEach((member) => {
    member.addEventListener("click", () => {
        const name = member.getAttribute("data-name");
        const profile = profiles[name];
        if (profile) {
            document.getElementById("profileTitle").textContent = profile.title;
            document.getElementById("profileContent").innerHTML =
                profile.content.replace(/\n/g, "<br>");
            document.getElementById("profileModal").style.display = "block";
        }
    });
});

window.onclick = function (event) {
    const modal = document.getElementById("profileModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
