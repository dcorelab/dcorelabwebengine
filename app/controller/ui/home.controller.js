


class HomeController {
    home = async (req, res) => {
        res.render('ui/index', { title: 'Home' });
    }
}

module.exports = new HomeController();