class Api::V1::UsersController < Api::V1::BaseController

  def index
    @users = User.scoped
    @users = @users.limit(params[:limit]) if params[:limit].present?
  end

  def show
    @user = User.find(params[:id])
  end

end
