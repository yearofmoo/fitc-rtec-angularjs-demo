class Api::V1::CommentsController < Api::V1::BaseController

  def index
    if params[:user_id].present?
      @comments = User.find(params[:user_id]).comments
    else 
      @comments = Comment.latest
    end
    @comments = @comments.limit(params[:limit]) if params[:limit].present?
  end

end
