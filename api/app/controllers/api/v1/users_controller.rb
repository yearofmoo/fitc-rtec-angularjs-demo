class Api::V1::UsersController < Api::V1::BaseController

  def index
    @users = User.scoped
  end

  def show
    @user = User.find(params[:id])
  end

end
