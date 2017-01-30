class UploadImageController < ApplicationController
    def post
        image = Image.create(
          :owner=>current_user,
        )
        image.postImage = params[:file]
        image.save!
        current_user.post_images.push(image)
        current_user.update
        
        byebug
        render json: image.postImage
    end
    def get_image
      @image = Image.find(params[:id])
      content = @image.postImage.read
      send_data content, type: @image.postImage.file.content_type, disposition: "inline"
    end
end
