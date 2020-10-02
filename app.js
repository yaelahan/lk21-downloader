const axios    = require('axios');
const inquirer = require('inquirer');

const getList = async (kw) => {
    try {
        let r = await axios.get(`http://149.56.24.226//?s=${kw}`);
        return await r.data.results;
    } catch (err) {
        return await err.response.data;
    }
}

const getLink = async (slug) => {
    try {
        let r = await axios({
            url: `https://asdahsdkjajslkfbkaujsgfbjaeghfyjj76e8637e68723rhbfajkl.akurat.co/verifying.php?slug=${slug}`, 
            data : {slug: slug}, 
            headers: {
                'origin': 'https://asdahsdkjajslkfbkaujsgfbjaeghfyjj76e8637e68723rhbfajkl.akurat.co',
                'referer': `https://asdahsdkjajslkfbkaujsgfbjaeghfyjj76e8637e68723rhbfajkl.akurat.co/get/${slug}/`,
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        return await await r.data.match(/href="(.*?)(" rel)/g);
    } catch (err) {
        return await err.response.data;
    }
}

const generateChoise = (arr) => {
    let opt = [
        {
            type: 'list',
            name: 'menu',
            message: 'Choose:',
            choices: []
        }
    ];
    arr.forEach(el => opt[0].choices.push({name: el.title, value: el.slug}));
    return opt;
}

console.log(`=======================
    Lk21 Downloader
=======================`);
inquirer
    .prompt([{type: 'text', name: 'kw', message: 'Keyword :'}])
    .then(a => {
        (async () => {
            let list = await getList(a.kw);
            if (list.length > 0) {
                inquirer
                    .prompt(generateChoise(list))
                    .then(a2 => {
                        (async () => {
                            let link = await getLink(a2.menu);
                            link.forEach(el => {
                                if (el.match('360'))
                                    console.log('360P  => ' + el.match(/(?<=href=")(.*?)(?=")/g));
                                else if (el.match('480'))
                                    console.log('480P  => ' + el.match(/(?<=href=")(.*?)(?=")/g));
                                else if (el.match('720'))
                                    console.log('480P  => ' + el.match(/(?<=href=")(.*?)(?=")/g));
                                else
                                    console.log('1080P => ' + el.match(/(?<=href=")(.*?)(?=")/g));
                            });
                        })();
                    });
            } else {
                console.log('Result not found !');                
            }
        })();
    })
