class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  skip_before_action :ensure_login, only: [:main, :show]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
    @user = User.find(params[:user_id])
  end

  def main
    @posts = Post.all
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
  end

  # GET /posts/new
  def new
    @user = User.find(params[:user_id])
    @post = Post.new(:user=>@user)
    p @user, @post
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @user = User.find(params[:user_id])
    @post = Post.new(post_params)
    @post.user = @user
    p @user, @post


    respond_to do |format|
      if @post.save
        p 'post saving: '
        format.html { redirect_to user_post_path(@user, @post), notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: user_path(@user) }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    p '---------- posts_controller update ----------: ', @post
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to user_post_path(@post.user, @post), notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :body, :user)
    end
end
