class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, userId } = payload;

    this.content = content;
    this.userId = userId;
  }

  _verifyPayload({ content, userId }) {
    if (!content || !userId) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string" || typeof userId !== "string") {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReply;
