function checkAuth() {
    return new Promise(async (resolve) => {
        let res = await fetch("/api/checkauth", {
            credentials: "include"
        })
        if (res.status == 200) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

checkAuth().then(res => {
    if (res && window.location.pathname == "/") {
        window.location = "/dashboard.html"
    } else if (!res && window.location.pathname != "/") {
        window.location = "/"
    }
})