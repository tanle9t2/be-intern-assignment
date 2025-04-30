#!/bin/bash

# Base URLs for each controller
USERS_URL="http://localhost:3000/api/users"
ACTIVITY_LOG_URL="http://localhost:3000/api/activity-logs"
HASHTAG_URL="http://localhost:3000/api/hashtags"
LIKE_URL="http://localhost:3000/api/likes"
POSTS_URL="http://localhost:3000/api/posts"
POST_HASHTAGS_URL="http://localhost:3000/api/post-hashtags"
USER_FOLLOW_URL="http://localhost:3000/api/follows"
FEED_URL="http://localhost:3000/api/feed"
# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local header=$4  # Optional header

    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi

    if [ "$method" = "GET" ]; then
        if [ -n "$header" ]; then
            curl -s -X $method -H "$header" "$endpoint" | jq .
        else
            curl -s -X $method "$endpoint" | jq .
        fi
    else
        if [ -n "$header" ]; then
            curl -s -X $method -H "$header" -H "Content-Type: application/json" -d "$data" "$endpoint" | jq .
        else
            curl -s -X $method -H "Content-Type: application/json" -d "$data" "$endpoint" | jq .
        fi
    fi
    echo ""
}

test_get_feed() {
    print_header "Testing GET feed"
    read -p "Enter user ID: " user_id
    read -p "Enter page: " page
    read -p "Enter limit: " limit

    make_request "GET" "$FEED_URL/?page=$page&limit=$limit" "" "Authorization: $user_id"
}

test_get_post_by_tag() {
    print_header "Testing GET post by tag"
    read -p "Enter tag: " tag
    read -p "Enter page: " page
    read -p "Enter limit: " limit
    make_request "GET" "$POSTS_URL/hashtag/$tag?page=$page&limit=$limit"
}

test_get_follower() {
    print_header "Testing GET user's followers "
    read -p "Enter userId: " userId
    read -p "Enter page: " page
    read -p "Enter limit: " limit
    make_request "GET" "$USERS_URL/$userId/followers?page=$page&limit=$limit"
}
test_view_user_activity_history() {
    print_header "Testing GET activity by ID"
    read -p "Enter userId: " userId
    read -p "Enter activity type: " activityType
    read -p "Enter start date: " startDate
    read -p "Enter end date: " endDate
    make_request "GET" "$USERS_URL/$userId/activity?activityType=$activityType&startDate=$startDate&endDate=$endDate"
}

# Activity Log-related functions
test_get_all_activities() {
    print_header "Testing GET all activities"
    make_request "GET" "$ACTIVITY_LOG_URL"
}

test_get_activity_by_id() {
    print_header "Testing GET activity by ID"
    read -p "Enter activity ID: " activity_id
    make_request "GET" "$ACTIVITY_LOG_URL/$activity_id"
}

test_create_activity() {
    print_header "Testing POST create activity"
    read -p "Enter user ID: " userId
    read -p "Enter activity type (e.g., LIKE): " activityType
    read -p "Enter target ID: " targetId
    
    local activity_data=$(cat <<EOF
{
    "userId": "$userId",
    "activityType": "$activityType",
    "targetId": "$targetId"
}
EOF
)
    make_request "POST" "$ACTIVITY_LOG_URL" "$activity_data"
}

test_update_activity() {
    print_header "Testing PUT update activity"
    read -p "Enter activity id: " activityId
    read -p "Enter new activity type: " activityType
    read -p "Enter new target ID: " targetId
    read -p "Enter new created at: " createdAt
    
  local update_data="{"
    local has_data=false
    
    if [ -n "$activityType" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"activityType\": \"$activityType\""
        has_data=true
    fi
    
    if [ -n "$createdAt" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"createdAt\": \"$createdAt\""
        has_data=true
    fi
    
    update_data+="}"
    make_request "PUT" "$ACTIVITY_LOG_URL/$activityId" "$update_data"
}

test_delete_activity() {
    print_header "Testing DELETE activity"
    read -p "Enter activity ID to delete: " activity_id
    make_request "DELETE" "$ACTIVITY_LOG_URL/$activity_id"
}

# Hashtag-related functions
test_get_all_hashtags() {
    print_header "Testing GET all hashtags"
    make_request "GET" "$HASHTAG_URL"
}

test_get_hashtag_by_id() {
    print_header "Testing GET hashtag by ID"
    read -p "Enter hashtag ID: " hashtag_id
    make_request "GET" "$HASHTAG_URL/$hashtag_id"
}

test_create_hashtag() {
    print_header "Testing POST create hashtag"
    read -p "Enter tag name: " tagName
    
    local hashtag_data=$(cat <<EOF
{
    "tagName": "$tagName"
}
EOF
)
    make_request "POST" "$HASHTAG_URL" "$hashtag_data"
}

test_update_hashtag() {
    print_header "Testing PUT update hashtag"
    read -p "Enter hashtag ID to update: " hashtag_id
    read -p "Enter new tag name: " tagName
    
    local update_data=$(cat <<EOF
{
    "tagName": "$tagName"
}
EOF
)
    make_request "PUT" "$HASHTAG_URL/$hashtag_id" "$update_data"
}

test_delete_hashtag() {
    print_header "Testing DELETE hashtag"
    read -p "Enter hashtag ID to delete: " hashtag_id
    make_request "DELETE" "$HASHTAG_URL/$hashtag_id"
}
test_get_all_likes() {
    print_header "Testing GET all likes"
    make_request "GET" "$LIKE_URL/"
}

# Like-related functions
test_create_like() {
    print_header "Testing POST create like"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    
    local like_data=$(cat <<EOF
{
    "userId": "$userId",
    "postId": "$postId"
}
EOF
)
    make_request "POST" "$LIKE_URL" "$like_data"
}

test_get_likes_by_id() {
    print_header "Testing GET likes by ID"
    read -p "Enter post ID: " postId
    read -p "Enter user ID: " userId
    make_request "GET" "$LIKE_URL/$userId/$postId"
}
test_update_like() {
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    read -p "Enter new created at: " createdAt
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$createdAt" ]; then
        update_data+="\"createdAt\": \"$createdAt\""
        has_data=true
    fi
    
    update_data+="}"
    make_request "PUT" "$LIKE_URL/$userId/$postId" "$update_data"
}
test_delete_like() {
    print_header "Testing DELETE like"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    make_request "DELETE" "$LIKE_URL/$userId/$postId"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter user ID: " userId
    read -p "Enter post content: " content
    
    local post_data=$(cat <<EOF
{
    "userId": "$userId",
    "content": "$content"
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post_by_id() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " postId
    make_request "GET" "$POSTS_URL/$postId"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID: " postId
    read -p "Enter new content: " content
    
    local update_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$postId" "$update_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID: " postId
    make_request "DELETE" "$POSTS_URL/$postId"
}


# UserFollow-related functions
test_create_follow() {
    print_header "Testing POST create follow"
    read -p "Enter follower ID: " followerId
    read -p "Enter followed ID: " followedId
    
    local follow_data=$(cat <<EOF
{
    "followerId": "$followerId",
    "followedId": "$followedId"
}
EOF
)
    make_request "POST" "$USER_FOLLOW_URL/" "$follow_data"
}

test_get_all_user_follow() {
    print_header "Testing GET ALL user follower"
    make_request "GET" "$USER_FOLLOW_URL/"
}

test_get_user_follow_by_id() {
    print_header "Testing GET following"
     read -p "Enter follower ID: " followerId
    read -p "Enter followed ID: " followedId
    make_request "GET" "$USER_FOLLOW_URL/$followerId/$followedId"
}

test_update_follow() {
    print_header "Testing PUT update follow"
    read -p "Enter follower ID: " followerId
    read -p "Enter followed ID: " followedId
    read -p "Enter new created at: " createdAt
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$createdAt" ]; then
        update_data+="\"createdAt\": \"$createdAt\""
        has_data=true
    fi
    
    update_data+="}"
    make_request "PUT" "$USER_FOLLOW_URL/$followerId/$followedId" "$update_data"

}

test_delete_user_follow() {
    print_header "Testing DELETE follow"
    read -p "Enter follower ID: " followerId
    read -p "Enter followed ID: " followedId
    make_request "DELETE" "$USER_FOLLOW_URL/$followerId/$followedId"
}
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    
    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi
    
    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi
    
    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi
    
    update_data+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

# Submenu functions
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

# Submenu functions
show_post_menu() {
    echo -e "\n${GREEN}Post Menu${NC}"
    echo "1. Get all"
    echo "2. Get by ID"
    echo "3. Create"
    echo "4. Update"
    echo "5. Delete"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_user_follow_menu() {
    echo -e "\n${GREEN}User Follow Menu${NC}"
    echo "1. Get all"
    echo "2. Get by ID"
    echo "3. Create"
    echo "4. Update"
    echo "5. Delete"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}
# Submenu functions for ActivityLog
show_activity_log_menu() {
    echo -e "\n${GREEN}Activity Log Menu${NC}"
    echo "1. Get all"
    echo "2. Get by ID"
    echo "3. Create"
    echo "4. Update"
    echo "5. Delete"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

# Submenu functions for Hashtags
show_hashtag_menu() {
    echo -e "\n${GREEN}Hashtags Menu${NC}"
    echo "1. Get all hashtags"
    echo "2. Get hashtag by ID"
    echo "3. Create new hashtag"
    echo "4. Update hashtag"
    echo "5. Delete hashtag"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

# Submenu functions for Likes
show_like_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Get all"
    echo "2. Get by ID"
    echo "3. Create"
    echo "4. Update"
    echo "5. Delete"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-5): "
}

show_special_menu() {
    echo -e "\n${GREEN}Special Endpoints Menu${NC}"
    echo "1. Get user feed"
    echo "2. Get posts by hashtag"
    echo "3. Get user followers"
    echo "4. Get user activity"
    echo "5. Back to main menu"
    echo -n "Enter your choice (1-5): "
}
# Main menu
show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Hashtags"
    echo "3. Likes"
    echo "4. Post"
    echo "5. User Follow"
    echo "6. Activity Log"
    echo "7. Special Endpoints"
    echo "8. Exit"
    echo -n "Enter your choice (1-8): "
}

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_hashtag_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_hashtags ;;
                    2) test_get_hashtag_by_id ;;
                    3) test_create_hashtag ;;
                    4) test_update_hashtag ;;
                    5) test_delete_hashtag ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_like_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_likes;;
                    2) test_get_likes_by_id ;;
                    3) test_create_like ;;
                    4) test_update_like ;;
                    5) test_delete_like ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_post_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post_by_id ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        5)
            while true; do
                show_user_follow_menu
                read follow_choice
                case $follow_choice in
                    1) test_get_all_user_follow ;;
                    2) test_get_user_follow_by_id ;;
                    3) test_create_follow ;;
                    4) test_update_follow ;;
                    5) test_delete_user_follow ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        6)
            while true; do
                show_activity_log_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_activities ;;
                    2) test_get_activity_by_id ;;
                    3) test_create_activity ;;
                    4) test_update_activity ;;
                    5) test_delete_activity ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        7)
            while true; do
                show_special_menu
                read user_choice
                case $user_choice in
                    1) test_get_feed ;;
                    2) test_get_post_by_tag ;;
                    3) test_get_follower ;;
                    4) test_view_user_activity_history ;;
                    5) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;

        8)
            echo "Exiting..."; exit 0 ;;
        *)
            echo "Invalid choice. Please try again." ;;
    esac
done
