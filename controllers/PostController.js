import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat();

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getPostsByTag = async (req, res) => {
	try {
	  const { id } = req.params;
	  const posts = await PostModel.find({ tags: id }).populate('user').exec();
	  res.json(posts);
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		 message: 'Не удалось получить посты с тегом',
	  });
	}
 };
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const createComment = async (req, res) => {
	try {
	  const postId = req.params.id;
	  const { fullName, avatarUrl, text } = req.body;
 
	  const post = await PostModel.findById(postId);
 
	  if (!post) {
		 return res.status(404).json({
			message: 'Пост не найден',
		 });
	  }
 
	  const comment = {
		 fullName: fullName,
		 avatarUrl: avatarUrl,
		 text: text,
	  };
 
	  post.comments.push(comment);
 
	  await post.save();
 
	  res.status(201).json({
		 message: 'Комментарий успешно добавлен',
		 comment: comment,
	  });
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		 message: 'Не удалось добавить комментарий',
	  });
	}
 };

 export const getComments = async (req, res) => {
	try {
	  const postId = req.params.id;
 
	  const post = await PostModel.findById(postId).populate("comments.user");
 
	  if (!post) {
		 return res.status(404).json({
			message: "Пост не найден",
		 });
	  }
 
	  const comments = post.comments;
 
	  res.status(200).json(comments);
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		 message: "Ошибка при получении комментариев",
	  });
	}
 };

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
