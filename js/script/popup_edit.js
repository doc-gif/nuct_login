function set_data() {
    let user_id;
    let username_key = 'username';
    let password_key = 'password';
    let secret_key = 'secret';
    let option_name_key = 'option_name';
    chrome.storage.sync.get('target_id', (value) => {
        user_id = value['target_id'];
        username_key += user_id;
        password_key += user_id;
        secret_key += user_id;
        option_name_key += user_id;
        chrome.storage.sync.get([username_key, password_key, secret_key, option_name_key], (value2) => {
            document.getElementById('username').value = value2[username_key];
            document.getElementById('password').value = value2[password_key];
            document.getElementById('token').value = value2[secret_key];
            document.getElementById('option_name').value = value2[option_name_key];
        })
    })
}

function edit_storage() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secret = document.getElementById('token').value;
    const option_name = document.getElementById('option_name').value;
    if (username === '' || password === '' || secret === '') {
        alert('入力されていないフォームがあります。');
    } else {
        chrome.storage.sync.get('target_id', (value) => {
            const target_id = value['target_id'];
            const username_key = 'username' + String(target_id);
            const password_key = 'password' + String(target_id);
            const secret_key = 'secret' + String(target_id);
            const option_name_key = 'option_name' + String(target_id);
            chrome.storage.sync.set({
                [username_key]: username,
                [password_key]: password,
                [secret_key]: secret,
                [option_name_key]: option_name
            }, () => {
                chrome.storage.sync.get([username_key, password_key, secret_key, option_name_key], (values) => {
                    window.location.href = '../html/popup_index.html';
                })
            });
        })
    }
}

function delete_user(target, total) {
    // let i = target + 1でもいいかも?
    for (let i = target; i <= total; i++) {
        const ouk = 'username'+i;
        const opk = 'password'+i;
        const osk = 'secret'+i;
        const ook = 'option_name'+i;
        if (i !== target) {
            const euk = 'username'+(i-1);
            const epk = 'password'+(i-1);
            const esk = 'secret'+(i-1);
            const eok = 'option_name'+(i-1);
            chrome.storage.sync.get([ouk, opk, osk, ook], (odata) => {
                chrome.storage.sync.set({
                    [euk]: odata[ouk],
                    [epk]: odata[opk],
                    [esk]: odata[osk],
                    [eok]: odata[ook]
                })
            })
        }
    }
    const tuk = 'username'+total;
    const tpk = 'password'+total;
    const tsk = 'secret'+total;
    const tok = 'option_name'+total;
    chrome.storage.sync.remove([tuk, tpk, tsk, tok]);
    chrome.storage.sync.get('num_user', (value3) => {
        chrome.storage.sync.set({
            'num_user': value3['num_user']-1
        }, () => {
            window.location.href = '../html/popup_index.html';
        })
    })
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
    document.getElementById('delete').addEventListener('click', () => {
        chrome.storage.sync.get(['target_id', 'num_user'], (value1) => {
            delete_user(value1['target_id'], value1['num_user']);
        })
        alert('削除されました。');
    });
    document.getElementById('edit').addEventListener('click', () => {
        edit_storage();
    });
    document.getElementById('show_password').addEventListener('click', () => {
        change_type('password');
    });
    document.getElementById('show_token').addEventListener('click', () => {
        change_type('token');
    });
    set_data();
});
