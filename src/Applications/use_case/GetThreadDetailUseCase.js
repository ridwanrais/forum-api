class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    relationRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._relationRepository = relationRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const threadDetail = await this._threadRepository.getThreadDetail(threadId);
    const commentsIdArr = await this._relationRepository.getCommentsId(
      threadId
    );

    let i = 0;
    while (i < commentsIdArr.length) {
      const commentDetail = await this._commentRepository.getCommentDetail(
        commentsIdArr[i]
      );
      if (commentDetail.isDeleted) {
        commentDetail.content = "**komentar telah dihapus**";
      }

      const repliesIdArr = await this._relationRepository.getRepliesId(
        commentsIdArr[i]
      );

      let j = 0;
      while (j < repliesIdArr.length) {
        const replyDetail = await this._replyRepository.getReplyDetail(
          repliesIdArr[j]
        );
        if (replyDetail.isDeleted) {
          replyDetail.content = "**balasan telah dihapus**";
        }

        commentDetail.replies.push(replyDetail);
        j += 1;
      }

      threadDetail.comments.push(commentDetail);
      i += 1;
    }

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
