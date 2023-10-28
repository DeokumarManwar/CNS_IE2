const { Router, response } = require("express");
const router = require("express").Router();
const user = require("../models/user");
const crypto = require("crypto");

router.get("/login", async (req, res) => {
  try {
    const username = req.headers.username;
    const providedPassword = req.headers.password;

    const userRecord = await user.findOne({ userName: username });

    if (userRecord) {
      // SHA-1 hashing for the provided password
      const sha1Hash = crypto
        .createHash("sha1")
        .update(providedPassword)
        .digest("hex");

      // Decipher the transposed hash and compare it to the stored hash
      const transpositionKey = process.env.key; // Replace with your key
      const storedTransposedHash = userRecord.password;
      const decipheredHash = transpose(sha1Hash, transpositionKey);

      console.log(decipheredHash, storedTransposedHash);
      if (decipheredHash === storedTransposedHash) {
        return res.status(200).send({ success: true, user: userRecord });
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
  const { userName, password, image_url } = req.body;
  const existingUser = await user.findOne({ userName: userName });

  if (existingUser) {
    return res.status(409).json({ message: "User Already Exists" });
  }

  // SHA-1 hashing
  const sha1Hash = crypto.createHash("sha1").update(password).digest("hex");

  // Columnar Transposition Cipher
  const transpositionKey = process.env.key; // Replace with your key
  const transposedHash = transpose(sha1Hash, transpositionKey);

  console.log(transposedHash);
  const newUser = {
    userName,
    password: transposedHash,
    image_url,
  };

  const savedUser = await user.create(newUser);

  return res.status(200).send({ success: true, user: savedUser });
});

// Function to perform columnar transposition
function transpose(input, key) {
  let output = "";
  const keyLength = key.length;
  const inputLength = input.length;

  for (let i = 0; i < keyLength; i++) {
    let index = i;
    while (index < inputLength) {
      output += input[index];
      index += keyLength;
    }
  }

  return output;
}

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
