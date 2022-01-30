const cheerio = require('cheerio');
const superagent = require('superagent');
const fs = require('fs');
const numberOfChallenge = 10;

const config = require('./config');

var TurndownService = require('turndown');

var td = new TurndownService();

const urlLogin = "https://training.codinsa.org/user/signin/check";
const urlQualif = "https://training.codinsa.org/qualifications";

const agent = superagent.agent();
agent.post(urlLogin)
    .send({
        _username: config.user,
        _password: config.pass
    }) // sends a JSON post body
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Cookie', 'PHPSESSID=38d6a5748f7e08ddb0c94bd76d84649f')
    // Above is the default session ID when using a fresh private window
    .end((err, res) => {
        // Calling the end function will send the request
        console.log("logged");
        agent.get(urlQualif).then((res) => {
            const $ = cheerio.load(res.text);
            const list = $("table tr");
            list.slice(1, config.nbChallenges + 1).each((idx, el) => {
                let first_td = $(el).children('td')[0];
                let a = $(first_td).children('a');
                let href = $(a).attr("href");
                let dossier = $(a).text()
                  .replaceAll(' ', '_')
                  .replaceAll('.', '')
                  .replaceAll('/', '')
                  .replaceAll('(', '')
                  .replaceAll(')', '');
                fs.mkdir(__dirname + '/' + dossier, (err) => {
                    if (err && err.code != 'EEXIST') throw err;
                    console.log("Created dossier " + dossier);
                });

                // maintenant, allons chercher sur chacune de ces url
                agent.get(href).then((res) => {
                    let $2 = cheerio.load(res.text);

                    fs.appendFile(__dirname + '/' + dossier + "/id.txt", href.split('question/')[1], (err) => {
                        if (err) throw err;
                        console.log("\tAdded exercise ID");
                    })

                    fs.copyFile(__dirname + '/templateChallenge/template.js', __dirname + '/' + dossier + '/template.js', (err) => {
                        if (err) throw err;
                        console.log('\nDossier : ' + dossier + '\n\tAdded template.js');
                    });

                    let sujet = res.text.split('<h3>Sujet</h3>')[1].split('<h3>Exemples')[0];
                    fs.appendFile(__dirname + '/' + dossier + "/sujet.md", td.turndown(sujet.toString()), (err) => {
                        if (err) throw err;
                        console.log("\tAdded sujet");
                    })

                    let entrees = res.text.split('<pre style="font-family: monospace;">');
                    let entrees_traitees = [];

                    for (let entree of entrees) {
                        let entree_coupe = entree.split('</pre>');
                        if (entree_coupe.length > 1 && entree_coupe[0].length < 800) entrees_traitees.push(entree_coupe[0]);
                        if (entree_coupe.length > 1 && entree_coupe[0].length > 800) {
                            fs.appendFile(__dirname + '/' + dossier + '/inputTemplate.txt', entree_coupe[0].split('<pre>')[1] + "", (err) => {
                                if (err) throw err;
                                console.log('\tAdded template input');
                            })
                        }
                    }
                    entrees_traitees.forEach((e, i) => {
                        fs.appendFile(__dirname + '/' + dossier + '/input' + i + '.txt', e, (err) => {
                            if (err) throw err;
                            console.log("\tInput " + i + " added");
                        })
                    });
                }).catch(err => console.log(`Failed to fetch ${href} : ${err}`));
            });
        });
        console.log("Loading Files...");
    });
