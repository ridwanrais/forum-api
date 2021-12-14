/* eslint-disable camelcase */
/* eslint-disable no-shadow */

const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThread(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentIds = comments.map((comment) => comment.id);
    const bulkReplies = await this._replyRepository.getRepliesByCommentIds(
      commentIds
    );

    // const bulkLikes = await this._likeRepository.getLikesByCommentIds(
    //   commentIds
    // );

    return new ThreadDetail({
      ...thread,
      comments: this.getCommentsAndReplies(comments, bulkLikes, bulkReplies),
    });
  }

  getCommentsAndReplies(comments, bulkLikes, bulkReplies) {
    return comments.map((comment) => {
      const likeCount = bulkLikes.filter(
        (like) => like.comment_id === comment.id
      ).length;

      return new CommentDetail({
        ...comment,
        likeCount,
        isDeleted: comment.is_delete,
        content: comment.is_delete
          ? "**komentar telah dihapus**"
          : comment.content,
        replies: this.getRepliesForComment(bulkReplies, comment.id),
      });
    });
  }

  getRepliesForComment(bulkReplies, commentId) {
    return bulkReplies
      .filter((reply) => reply.comment_id === commentId)
      .map(
        (reply) =>
          new ReplyDetail({
            ...reply,
            isDeleted: reply.is_delete,
            content: reply.is_delete
              ? "**balasan telah dihapus**"
              : reply.content,
          })
      );
  }
}

module.exports = GetThreadDetailUseCase;
