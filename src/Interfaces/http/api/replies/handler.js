const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { content } = request.payload;
    const { id } = request.auth.credentials;
    const { commentId, threadId } = request.params;

    const addedReply = await addReplyUseCase.execute({
      content,
      userId: id,
      commentId,
      threadId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    const { id } = request.auth.credentials;
    const { commentId, replyId } = request.params;

    await deleteReplyUseCase.execute({
      userId: id,
      commentId,
      replyId,
    });

    return {
      status: "success",
    };
  }
}

module.exports = RepliesHandler;
