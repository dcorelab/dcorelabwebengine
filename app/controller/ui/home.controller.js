


class HomeController {
    home = async (req, res) => {
        res.render('ui/index', { title: 'Dcore Lab | Official Site',
    path: req.path });
    }
}

module.exports = new HomeController();