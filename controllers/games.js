const Game = require("../model/brag");
const User = require("../model/user");

const index = (req, res) => {
  Game.find(
    { game: { $in: ["Call Of Duty", "Destiny", "Fortnite", "Halo"] } },
    async (err, games) => {
      if (err) {
        return res.redirect("/games/new");
      } else {
        const sortedGames = games.sort((a, b) => (a.date > b.date ? 1 : -1));
        res.render("games/index", {
          title: "All Game Brags",
          user: req.user,
          games
        });
      }
    }
  );
};

const show = (req, res) => {
  Game.findById(req.params.id)
    .populate("user")
    .exec((err, game) => {
      res.render("games/show", {
        title: "Game Brag Detail",
        id: req.params.id,
        user: req.user,
        game
      });
    });
};

const newBrag = (req, res) => {
  res.render("games/new", {
    title: "Add Game Brag",
    user: req.user
  });
};

const deleteBrag = (req, res) => {
  Game.findByIdAndDelete({ _id: req.params.id }, (err, game) => {
    if (err) {
      return res.redirect("/games");
    } else {
      res.redirect("/games");
    }
  });
};

const create = (req, res) => {
  User.findById(req.user._id, async (err, user) => {
    for (let key in req.body) {
      if (req.body[key] === "") delete req.body[key];
    }
    let game = await new Game(req.body);
    user.brags.push(game);
    await user.save();
    game.user.push(user);
    await game.save();
    res.redirect(`/games`);
  });
};

const edit = (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    res.render("games/edit", {
      id: req.params.id,
      user: req.user,
      game
    });
  });
};

const update = (req, res) => {
  Game.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("RESULT: " + result);
    res.redirect("/games/");
  });
};

module.exports = {
  index,
  show,
  new: newBrag,
  create,
  delete: deleteBrag,
  edit,
  update
};
