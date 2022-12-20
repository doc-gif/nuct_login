function set_storage() {
    const username = document.forms[0].elements['username'].value;
    const password = document.getElementById('password').value;
    const secret = document.getElementById('token').value;
    const option_name = document.getElementById('option_name').value;
    if (username === '' || password === '' || secret === '') {
        alert('入力されていないフォームがあります。');
    } else {
        chrome.storage.sync.get('num_user', (value) => {
            if (value.num_user === undefined) {
                chrome.storage.sync.set({
                    'username1': username,
                    'password1': password,
                    'secret1': secret,
                    'option_name1': option_name,
                    'num_user': 1
                }, () => {
                    window.location.href = '../html/popup_index.html';
                });
            } else {
                const num_user = value.num_user+1;
                const username_key = 'username' + String(num_user);
                const password_key = 'password' + String(num_user);
                const secret_key = 'secret' + String(num_user);
                const option_name_key = 'option_name' + String(num_user);
                chrome.storage.sync.set({
                    [username_key]: username,
                    [password_key]: password,
                    [secret_key]: secret,
                    [option_name_key]: option_name,
                    'num_user': num_user
                }, () => {
                    chrome.storage.sync.get([username_key, password_key, secret_key, option_name_key], (values) => {
                        window.location.href = '../html/popup_index.html';
                    })
                });
            }
        })
    }
}

function change_type(target_id) {
    const target = document.getElementById(target_id);
    if (target.type === 'password') {
        target.type = 'text';
    } else {
        target.type = 'password';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register').addEventListener('click', () => {
        set_storage();
    });
    document.getElementById('show_password').addEventListener('click', () => {
        change_type('password');
    });
    document.getElementById('show_token').addEventListener('click', () => {
        change_type('token');
    });
});
