import { FastifyPluginAsync } from 'fastify'
import { prisma } from '../lib/prisma'
import { Phrase } from '@prisma/client';



// ******************************************
// Attention: the Phrase Table's count has been hardcoded for performance and simplicity.
const phraseTableStartingIndex = 1
const phraseTableCount = 46085
// ******************************************

interface IHeaders {
  'x-rapidapi-proxy-secret': string|undefined;
}

interface IReply {
  200: {phrase:string};
  302: { url: string };
  '4xx': { error: string };
  '5xx': { error: string };
}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get<{ Headers:IHeaders, Reply:IReply }>(
    '/',
    async  (request, reply) => {
      const rapidapiHeader = request.headers['x-rapidapi-proxy-secret']
      if(rapidapiHeader==null || process.env.RAPIDAPI_SECRET !== rapidapiHeader){
        reply.status(400).send({error:`Request headers x-rapidapi-proxy-secret is invalid. rapidapiHeader:${rapidapiHeader}`})
        return
      }
  
      let phrase:Phrase|undefined|null
      try{
        phrase = await prisma.phrase.findFirst({
          where:{id:Math.floor(Math.random() * phraseTableCount) + phraseTableStartingIndex}
        })
      }catch(e){
        console.error("SERVER ERROR:",e)
        reply.status(400).send({error:`A server error has occurred! Please let us know.`})
        return
      }
    
        if(phrase==null){
          console.error("SERVER ERROR: phrase==null")
          reply.status(500).send({error:`Server Error: phrase should be string but it is ${phrase}`})
          return
        }
    
        reply.status(200).send({ phrase: phrase.content });
    }
  )
}






export default root;
