
const router = require('use-router')();
const fetch = require('lib/fetch');

router.all('/user-agent', function(req, resp, next){
  const {store} = req;
  return fetch('http://httpbin.org/user-agent').then(resp=>resp.json()).then(result=>{
    store.setState({userAgent: result["user-agent"]});
  })
})

module.exports = router;
