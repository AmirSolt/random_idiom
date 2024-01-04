import { FastifyPluginAsync } from 'fastify'
import { prisma } from '../lib/prisma'



// ******************************************
// Attention: the Phrase Table's count has been hardcoded for performance and simplicity.
const phraseTableStartingIndex = 1
const phraseTableCount = 46085
// ******************************************


interface IReply {
  200: {phrase:string};
  302: { url: string };
  '4xx': { error: string };
  '5xx': { error: string };
}


const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get<{ Reply:IReply }>(
    '/',
    async  (request, reply) => {
  
      const phrase = await prisma.phrase.findFirst({
        where:{id:Math.floor(Math.random() * phraseTableCount) + phraseTableStartingIndex}
      })
  
      if(phrase==null){
        reply.status(500).send({error:`Server Error: phrase should be string but it is ${phrase}`})
        return
      }
  
      reply.status(200).send({ phrase: phrase.content });
    }
  )
}


export default root;
