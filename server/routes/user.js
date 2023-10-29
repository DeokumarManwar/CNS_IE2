const { Router, response } = require("express");
const router = require("express").Router();
const user = require("../models/user");
const crypto = require("crypto");

// Function to perform columnar transposition
function transpose(input, key) {
  const keyLength = key.length;
  const inputLength = input.length;
  const numRows = Math.ceil(inputLength / keyLength);
  const grid = [];

  // Create a grid to hold the characters
  for (let i = 0; i < numRows; i++) {
    grid.push([]);
  }

  // Populate the grid with characters from the input
  for (let i = 0; i < inputLength; i++) {
    const row = Math.floor(i / keyLength);
    const col = i % keyLength;
    grid[row][col] = input[i];
  }

  // Read characters from the grid based on the key order
  let output = "";
  for (let col = 0; col < keyLength; col++) {
    const keyIndex = key.indexOf(col + 1);
    for (let row = 0; row < numRows; row++) {
      if (grid[row][keyIndex] !== undefined) {
        output += grid[row][keyIndex];
      }
    }
  }

  console.log(output);
  return output;
}

router.get("/login", async (req, res) => {
  try {
    const username = req.headers.username;
    const providedPassword = req.headers.password;

    const userRecord = await user.findOne({ userName: username });
    console.log(username, userRecord);

    // Decipher the transposed hash and compare it to the stored hash
    const transpositionKey = process.env.key; // Replace with your key
    const storedTransposedHash = userRecord.password;

    if (userRecord) {
      console.log("Was I here");
      // SHA-1 hashing for the provided password
      const decipheredHash = transpose(providedPassword, transpositionKey);
      console.log(decipheredHash);
      const sha1Hash = crypto
        .createHash("sha1")
        .update(decipheredHash)
        .digest("hex");

      console.log(sha1Hash, storedTransposedHash);
      if (sha1Hash === storedTransposedHash) {
        return res.status(200).send({
          success: true,
          user: userRecord,
          Hashpassword: sha1Hash,
        });
      }
    }

    return res.status(400).send({ success: false, msg: "Login Failed" });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

router.put("/watchlist/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const data = await user.findByIdAndUpdate(
      filter,
      {
        watchlist: req.body.watchlist,
      },
      options
    );
    return res.status(200).send({ success: true, data: data });
  } catch (e) {
    return res.status(400).send({ success: false, msg: e });
  }
});

router.get("/getOne/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  try {
    const data = await user.findOne(filter);
    if (data) {
      return res.status(200).send({ success: true, user: data });
    }
  } catch (e) {
    return null;
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { userName, password, image_url } = req.body;
    console.log(userName, password, image_url);
    const existingUser = await user.findOne({ userName: userName });

    const transpositionKey = process.env.key; // Replace with your key

    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }

    const decipheredHash = transpose(password, transpositionKey);
    console.log(decipheredHash);

    const sha1Hash = crypto
      .createHash("sha1")
      .update(decipheredHash)
      .digest("hex");

    console.log(sha1Hash);

    const newUser = {
      userName: userName,
      password: sha1Hash,
      image_url: image_url,
    };

    const savedUser = await user.create(newUser);

    return res
      .status(200)
      .send({ success: true, user: savedUser, Hashpassword: sha1Hash });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const data = await user.find();
    if (data) {
      return res.status(200).send({ success: true, users: data });
    } else {
      return res.status(400).send({ success: false, msg: "Data Not Found" });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ success: false, msg: "Cannot get All Users" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  try {
    const result = await user.deleteOne(filter);
    if (result) {
      return res.status(200).send({
        success: true,
        msg: "Data Deleted Successfully",
        data: result,
      });
    } else {
      return res.status(400).send({ success: false, msg: "Data Not Found" });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ success: false, msg: "Cannot delete the user" });
  }
});

router.put("/like/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findByIdAndUpdate(
      filter,
      {
        likes: req.body.likes,
      },
      options
    );
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return res.status(400).send({ success: false, msg: e });
  }
});

router.put("/dislike/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findByIdAndUpdate(
      filter,
      {
        dislike: req.body.dislike,
      },
      options
    );
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return res.status(400).send({ success: false, msg: e });
  }
});

router.put("/review/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findByIdAndUpdate(
      filter,
      {
        reviews: req.body.reviews,
      },
      options
    );
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return res.status(400).send({ success: false, msg: e });
  }
});

router.put("/rating/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findByIdAndUpdate(
      filter,
      {
        ratings: req.body.ratings,
      },
      options
    );
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return res.status(400).send({ success: false, msg: e });
  }
});

module.exports = router;
