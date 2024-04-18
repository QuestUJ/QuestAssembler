@Route("/")
# Landing page

## Join game button
1. User clicks on the "Join game" button.
2. User is redirected to room dashboard ("/dashboard").


<br></br>
@Route("/dashboard")
# Room dashboard

## Create game button
1. User clicks on the "Create Game" button.
2. User is shown a "Create Game" modal.
3. User inputs data into "Name" and "Max Players" inputs.
4. User clicks on the "Create" button.
5. A new room card in dashboard is visible

## Redirect to room
1. User clicks on the room preview component.
2. User is redirected to a given room ("/room/:givenRoomId/story").

## Sign out
1. User clicks on the "Sign out" button.
2. User is redirected to landing page ("/").
  
  
<br></br>
@Route("/room/:id/chat/:secondCharacterId")
# ChatInGame
1. User writes his message to input field.
2. User clicks on the "Send" button.
3. Message is submitted to chat.

## Click on Players tab
1. User clicks on other character preview.
2. User is redirected to private chat with given character ("/room/:id/chat/:givenCharacterId/").

## Click on Rooms button in navboard
1. User clicks on the "Rooms" button.
2. User is redirected to the rooms dashboard ("/dashboard/").

## Click on Contact Game Master
1. User clicks on the "Contact Game Master" button.
2. User is redirected to chat with the Game Master ("/room/:id/chat/:gameMasterId/").

## Click on Submit action
1. User clicks on the "Submit action" button.
2. User is redirected to the Submit action view ("/room/:id/submit-action/").


<br></br>
@Route("/room/:id")
# Game Master room view

## Click on View Story button
1. User clicks on the "View Story" button.
2. User is redirected to the Story view ("/room/:id/story/").

## Click on Submit story chunk button
1. User clicks on the "Submit story chunk" button.
2. User is redirected to the Submit story chunk view ("/room/:id/submit-story-chunk/").

## Click on Players' submits button
1. User clicks on the "Players' submits" button.
2. User is redirected to the Players' submits view ("/room/:id/players-submits").

## Click on AI support button
1. User clicks on AI support button.
2. User is redirected to AI support view ("/room/:id/ai-assistance").


<br></br>
@Route("/room/:id/ai-assistance")
# Game Master AI support

## Game Master requests assistance from AI
1. User inputs prompt to the input field.
2. User clicks on the "Generate" button.
3. Generated content is sent to the user.


<br></br>
@Route("/room/:id/players-submits")
# Game Master Players' submits

## Game Master Players' submits
1. User is being shown current Players's submits.


<br></br>
@Route("/room/:id/story/")
# Game Master View story

## Game Master wants to submit story chunk
1. User inputs content into text area.
2. User clicks on the "Submit story chunk" button.
3. Story chunk is sent and can be accessed in Story view.

## Game Master wants to rewrite the story with LLM assistance.
1. User inputs content into text area.
2. User clicks on the "Rewrite with LLM" button.
3. Content generated with AI is sent to the user.

## Game Master wants to upload image
1. User chooses the image.
2. User clicks on the "Upload Your Image" button.
3. Image is sent from the user.

<br></br>
# Mobile

## User clicks the breadcrumb
1. User clicks on the breadcrumb button.
2. User is shown the character views and tools.

