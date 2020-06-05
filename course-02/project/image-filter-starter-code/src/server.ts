import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

 // @TODO1 IMPLEMENT A RESTFUL ENDPOINT

  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    let { image_url } = req.query;
    //1. validate the image_url query
    if(!image_url){
      return res.status(400).send('Image url is required');
    }  
     //  2. call filterImageFromURL(image_url) to filter the image
    const filteredpath = await filterImageFromURL(image_url);
     //3. send the resulting file in the response
    await res.status(200).sendFile(filteredpath, {}, (err) => {
      if (err) { return res.status(422).send(`Unprocessable`); }
      //deletes any files on the server on finish of the response
      deleteLocalFiles([filteredpath])
    })
  } );

// Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();