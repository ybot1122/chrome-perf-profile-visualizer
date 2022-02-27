import formidable from "formidable";

const post = async (req, res) => {
  const form = new formidable.IncomingForm();

  console.log(form);

  form.parse(req, async function (err, fields, files) {
    console.log(files);
    return res.status(201).send("");
  });

  res.status(400).json({ error: "No file found" });
};

const handler = (req, res) => {
  req.method === "POST" ? post(req, res) : res.status(404).send("POST only");
};

export default handler;
