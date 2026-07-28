

class HomeController {
    home = async (req, res) => {
        res.render('ui/index', { title: 'Dcore Lab | Official Site', path: req.path });
    }

    about = async (req, res) => {
        res.render('ui/about', { title: 'About Us | Dcore Lab', path: req.path });
    }

    services = async (req, res) => {
        res.render('ui/services', { title: 'Services | Dcore Lab', path: req.path });
    }

    portfolio = async (req, res) => {
        res.render('ui/portfolio', { title: 'Portfolio | Dcore Lab', path: req.path });
    }

    blog = async (req, res) => {
        res.render('ui/blog', { title: 'Blog | Dcore Lab', path: req.path });
    }

    contactus = async (req, res) => {
        res.render('ui/contactus', { title: 'Contact Us | Dcore Lab', path: req.path });
    }
}

module.exports = new HomeController();
