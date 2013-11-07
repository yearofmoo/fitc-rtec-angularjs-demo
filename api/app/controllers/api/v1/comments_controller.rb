class Api::V1::CommentsController < Api::V1::BaseController

  def index
    @comments = Comment.scoped
  end

end
