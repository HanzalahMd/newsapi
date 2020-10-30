const express = require('express');
const hbs = require('express-handlebars');
const fetch = require('node-fetch');
const withQuery = require('with-query').default;

const app = express();

app.engine('hbs', hbs({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs');

const API_KEY = 'e68bfd865eb3460781352c9c65ed23fa';
const URL = 'https://newsapi.org/v2/top-headlines';

app.get('/', (req, res)=>{
    res.status(200);
    res.type('text/html');
    res.render('index');
})

app.get('/search', async (req,res)=>{
    console.log(req.query);
    const search = req.query.search;
    const country = req.query.country;
    const category = req.query.category;

    const full_url = withQuery(URL,
        {
            q: search,
            country: country,
            category: category,
            apiKey: API_KEY
        })

    // console.log(full_url);

    const result = await fetch (full_url);
    const news = await result.json();

    console.log(news);

    const displayNews = news.articles.map(
        (d) => {
            return { title: d.title, img: d['urlToImage'], summary: d.description, url: d.url, time: d.publishedAt }
        }
    )

    console.log(displayNews);


    res.status(200);
    res.type('text/html');
    res.render('result', {
        search: search,
        displayNews: displayNews,
        hasContent: displayNews.length > 0
    })
})

app.use(
    express.static(__dirname + '/static')
)

app.listen(3000, ()=>{
    console.log(`Application has started on ${new Date}`);
})