class UploadImageController < ApplicationController
  skip_before_action :authenticate_user!, only: [:get_image]
  def show
      @image = Image.find(params[:id])
  end
    def post
        byebug
        image = Image.new(
          :owner=>current_user,
        )
        image.postImage = params[:file]
        if image.save
          current_user.post_images.push(image)
          current_user.update
          render json: image.postImage
        else
          render status: 500, json: { errors: ["Failed to read image. Please check file type."]}
        end
    end
    def get_image
      @image = Image.find(params[:id])
      content = @image.postImage.read
      send_data content, type: @image.postImage.file.content_type, disposition: "inline"
    end
    def get_thumb_image
      @image = Image.find(params[:id])
      content = @image.postImage.thumb.read
      send_data content, type: @image.postImage.thumb.file.content_type, disposition: "inline"
    end
end
