var regiterForm = document.getElementById('regiterForm');
var submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function () {
    if (regiterForm.username.value === '' || regiterForm.password.value === '' 
    || regiterForm.repassword.value === '') {

    } else if (regiterForm.password.value !== regiterForm.repassword.value) {
        console.log('密码不一致');
    } else {
        Ajax({
            url: '/signup/register',
            type: 'post',
            data: {
                username: regiterForm.username.value,
                password: regiterForm.password.value,
                gender: regiterForm.gender.value,
                signature: regiterForm.signature.value
            },
            succuss: function (data) {
                if (data.code === 302) {
                    location.href = data.data.url;
                } else if (data.code === 1001) {
                    console.log(data.errorMessage);
                }
            }
        })
    }
}, false);

function isObject (object) {
    return typeof object === 'object' && object !== null
}