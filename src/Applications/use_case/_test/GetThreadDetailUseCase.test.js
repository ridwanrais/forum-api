const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/threads/entities/CommentDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/threads/CommentRepository");
const ReplyRepository = require("../../../Domains/threads/ReplyRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };
    const expectedCommentDetail = new CommentDetail({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      content: "sebuah comment",
      date: "2021-08-08T07:22:33.555Z",
      username: "johndoe",
      replies: [],
    });
    const expectedThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [],
    });
    const expectedThreadDetailFull = new ThreadDetail({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [expectedCommentDetail, expectedCommentDetail],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetail));
    mockCommentRepository.getCommentDetail = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetail));
    mockReplyRepository.getRepliesId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([expectedCommentDetail.id, expectedCommentDetail.id])
      );

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetailFull);
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(
      expectedCommentDetail.id
    );
  });
});
