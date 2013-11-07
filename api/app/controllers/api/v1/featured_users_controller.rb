class Api::V1::FeaturedUsersController < Api::V1::BaseController

  def index
    @featured = FeaturedUser.latest
    @featured = @featured.limit(params[:limit]) if params[:limit].present?
  end

end
