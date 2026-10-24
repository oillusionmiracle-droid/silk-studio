export type BlogImage = { src: string; alt: string; caption: string; credit: string; source: string; width?: number; height?: number };
export type NoteSection = { heading: string; paragraphs: string[]; bullets?: string[]; template?: string };
export type Note = { slug: string; title: string; category: string; summary: string; readTime: string; published: string; image: BlogImage; sections: NoteSection[]; takeaway: string; sources?: { title: string; url: string; date: string }[] };
const desk: BlogImage = { src:'/images/blog/gemini-business-tools.jpg', alt:'Google’s announcement graphic showing Gemini brand styles, connected apps and content templates', caption:'Google’s announcement puts brand styles, connected apps and content templates in one place.', credit:'Google / The Keyword', source:'https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/' };
const camera: BlogImage = { src:'/images/blog/camera-and-phone.jpg', alt:'A mirrorless camera and smartphone beside a laptop, photographed in black and white', caption:'You already have the equipment. A repeatable story can give it a better job.', credit:'Miguel A Amutio / Unsplash', source:'https://unsplash.com/photos/black-and-white-view-of-a-camera-phone-and-laptop-Fqj1Zbu0CqE' };
const colour: BlogImage = { src:'/images/blog/colour-swatches.jpg', alt:'Fans of Pantone colour swatches spread across a table', caption:'A colour on your screen is a starting point. A physical proof answers a different question.', credit:'Photo via Unsplash', source:'https://unsplash.com/photos/a-bunch-of-different-colors-of-paper-on-a-table-iWmgD20Mne0' };
const phone: BlogImage = { src:'/images/blog/phone-and-camera.jpg', alt:'A smartphone and camera on a wooden table beside a laptop', caption:'Before opening the camera, decide what the person watching needs to understand.', credit:'Ameen ALmayuf / Unsplash', source:'https://unsplash.com/photos/black-iphone-7-plus-and-dslr-camera-on-table-8kpsiLhifq0' };
const messages: BlogImage = { src:'/images/blog/customer-messages.jpg', alt:'Close view of someone typing on a smartphone held in both hands', caption:'A saved reply should make the next conversation easier, without making the customer feel rushed. Illustrative photo.', credit:'Photo via Unsplash', source:'https://unsplash.com/photos/hands-typing-on-a-smartphone-with-a-message-on-screen-SrgMu4Fvk7E' };
export const blogPosts: Note[] = [
{
  "slug": "ai-service-first-sample-seven-days-nigeria",
  "title": "Before you pay for another AI course, try this",
  "category": "Skills & opportunities",
  "summary": "A seven-day plan to turn AI learning into a useful service sample: choose a customer, make something real, test the offer and publish your proof.",
  "readTime": "5 min read",
  "published": "2026-10-24",
  "image": {
    "src": "/images/blog/ai-seven-day-experiment.jpg",
    "alt": "Seven illustrated days following a Nigerian creator from researching a food business to presenting a finished sample website and content",
    "caption": "One week, one finished sample. An illustrative journey, not a client testimonial or earnings result.",
    "credit": "Silk Studio · AI-generated illustration",
    "source": "https://www.silkstudios.com.ng/blog/ai-service-first-sample-seven-days-nigeria",
    "width": 1000,
    "height": 1500
  },
  "sections": [
    {
      "heading": "Another saved tutorial. Still nothing to show.",
      "paragraphs": [
        "You’ve saved the tutorial. Joined the group. Collected the prompts. Somehow, the thing you wanted to make is still in your head.",
        "Give the learning a job this week: make one useful thing for one specific type of customer. This seven-day experiment aims for a finished sample and real feedback. A sale would be a bonus, not a promise."
      ]
    },
    {
      "heading": "Start with a problem people recognise",
      "paragraphs": [
        "“I do AI” leaves a customer doing the thinking. “I turn your product footage into three short videos you can post this week” gives them something to assess.",
        "Pick something you can already deliver, or reasonably learn to deliver: tidy a small product catalogue, edit three short clips, or turn a service list into a clear one-page brochure. Choose one. Trying all three is how next week becomes another week of research."
      ]
    },
    {
      "heading": "Days 1–2: make the sample",
      "paragraphs": [
        "Pick one type of business—a food vendor, a clothing seller or a barber. Use your own material, get permission to use theirs, or make a clearly labelled fictional example. Show the original beside your finished version.",
        "Use an AI tool to outline ideas or spot unclear wording. Do the checking yourself. A beautiful menu with the wrong prices is a problem wearing good clothes."
      ]
    },
    {
      "heading": "Day 3: put a boundary around the offer",
      "paragraphs": [
        "Write down exactly what the customer gets: how many items, which file formats, what they must supply, when you can deliver, and how many revisions you include. Decide your price from the work involved and your costs. Don’t copy somebody’s dollar-income screenshot."
      ]
    },
    {
      "heading": "Days 4–5: ask for useful feedback",
      "paragraphs": [
        "Show the sample to a few relevant people who are open to hearing from you. Ask: “Would this solve a problem for your business? What would stop you using it?”",
        "If someone is interested, explain the scope and quote before beginning. Ask permission before making or publishing anything for their brand. Don’t mass-message strangers or promise results you can’t control."
      ]
    },
    {
      "heading": "Day 6: fix what they actually noticed",
      "paragraphs": [
        "Maybe the text is too small. Maybe the video looks good but leaves out how to order. Maybe you made a brochure for a business that needed a price list. That feedback is more useful than another folder of prompts."
      ]
    },
    {
      "heading": "Day 7: publish the proof",
      "paragraphs": [
        "Put the sample somewhere easy to open. Add three short lines: the problem, what you made, and what someone should send you to request it. Label concept work as concept work. No invented client, testimonial or sales result.",
        "Your scorecard: one finished sample, one clear offer, and the objections you heard. If nobody wants it, change the offer before paying for more tools."
      ]
    },
    {
      "heading": "Borrow this prompt",
      "paragraphs": [
        "Act as a practical editor. I want to offer [specific deliverable] to [type of business]. My current skills are [skills]. I have [time and equipment]. Help me define a small sample, the materials I need, a delivery checklist and five questions to test whether customers need it. Flag assumptions. Do not invent income claims or customer results.",
        "Want structured training alongside the experiment? Google’s 2026 Hustle Academy announcement describes free AI-focused learning for entrepreneurs in Nigeria, Kenya and South Africa. Check the programme page for current sessions and eligibility."
      ]
    }
  ],
  "takeaway": "Choose one deliverable and one kind of customer. Finish a sample, ask for feedback and improve the offer before buying more tools.",
  "sources": [
    {
      "title": "Google: Hustle Academy’s 2026 AI-focused learning programme",
      "url": "https://blog.google/intl/en-africa/from-side-hustle-to-digital-powerhouse-bridging-africas-100bn-ai-gap/",
      "date": "11 May 2026"
    }
  ]
},
 {slug:'gemini-small-business-tools-brand-brief',title:'Google can make your next campaign faster. It still needs to know what you’re selling.',category:'AI & tools',summary:'Gemini’s new business tools are an interesting update. The bigger opportunity is finally giving your brand a brief that makes sense.',readTime:'4 min read',published:'2026-10-24',image:desk,sections:[
 {heading:'Another AI tool. Another reason to open seventeen tabs?',paragraphs:['You need a flyer for Saturday. A customer wants a price list. Instagram needs feeding. Somewhere in all this, you were also supposed to run the actual business. An AI announcement promising to save time has your attention. Fair enough.', 'On 20 October, Google announced a business hub in Gemini, connections to business apps, and tools for creating visuals from uploaded brand guidelines. Google says the rollout is global and gradual. Check your account before reorganising your workflow around a feature you haven’t received.', 'Here’s our take: the useful part is continuity. Getting the tenth design to look as though it belongs to the first nine is often more valuable than producing ten more random options.']},
 {heading:'“Make it pop” is not a brand strategy.',paragraphs:['Upload a logo and a tool knows the shape of your logo. It still needs to know why someone should care about the thing beside it.', 'Imagine a food vendor in Yaba promoting office lunch delivery. “Delicious meals for everyone” leaves a lot unanswered. “Lunch delivered to offices in Yaba, orders close at 10am” gives the design a job. The location and deadline aren’t glamorous, but they help a hungry person make a decision.', 'Before you ask for visuals, write a small brief. Product. Customer. Offer. Evidence. Next step. Five lines will do. If you struggle with those lines, making more images is unlikely to solve the problem.']},
 {heading:'Give the tool a reference it can actually use.',paragraphs:['Put your approved logo, colours, type choices and a few examples of good work into one folder. Add one example you dislike and explain why. “Too crowded to read on a phone” is more useful than “bad vibes.”'],template:'PRODUCT: What exactly are we promoting?\nPERSON: Who needs it, and in what situation?\nPROMISE: What can we truthfully offer?\nPROOF: What can we show to support that?\nACTION: What should someone do next?\nKEEP CONSISTENT: Logo, colours, type and tone.\nCHECK: Price, spelling, dates and contact details.'},
 {heading:'Spend the saved time checking the real thing.',paragraphs:['Confirm stock. Read the date. Open the WhatsApp link from another phone. Look for text the model quietly invented.', 'For a product image, don’t let a nicer-looking generation become a different product. The customer is buying what you can deliver. Packaging, size and colour matter more than a beautiful imaginary reflection.', 'Try one campaign first. Make three assets from the same brief, then review them together. Would someone recognise the same business without seeing the logo? That’s a better test than whether each image looks impressive on its own.']}
 ],takeaway:'Write the five-line brief before you make another image. Reuse it for your designer, your AI tool and the person writing your caption.',sources:[{title:'Google: New Gemini tools for small business owners',url:'https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/',date:'20 October 2026'}]},
 {slug:'youtube-shorts-series-small-creators',title:'YouTube wants episodes. Your next Short could be the start of something.',category:'Creator culture',summary:'Shorts series gives creators another way to organise a story. Here’s a three-episode idea a small business could actually film.',readTime:'4 min read',published:'2026-10-24',image:camera,sections:[
 {heading:'The hardest part is deciding what to post after this one.',paragraphs:['You finish a video, choose the cover, rewrite the caption twice, and post. Lovely. Tomorrow the empty content calendar is looking at you again.', 'YouTube’s September announcement introduced Shorts series: seasons and episodes, with sequential playback and custom thumbnails, rolling out across web, mobile and TV. Availability can vary while a rollout reaches accounts.', 'The creative idea matters even before the button appears in your account. Instead of making five unrelated posts, give people a situation worth returning to. A series is a promise that the next episode will be worth their time.']},
 {heading:'A small business has more plot than it thinks.',paragraphs:['A last-minute customer request. The colour that looked fine on screen and wrong on fabric. A product that almost worked. The first prototype beside the fifth. There are decisions hiding in the ordinary work.', 'You don’t need to manufacture a crisis. Show the real choice and result, with permission where a customer or colleague is involved. A fictional scenario can work too—label it as a scenario rather than pretending it happened.']},
 {heading:'Try this: one order, three useful episodes.',paragraphs:['Say you make custom T-shirts. Build a small series around a clearly labelled sample order. Each episode should answer its own question.'],bullets:['Episode 1: “Will this design survive being printed small?” Show the artwork at actual size and identify the detail you’re testing.','Episode 2: “Same design, two fabrics.” Show the difference in the samples and explain the trade-off.','Episode 3: “The finished shirt, after a wash.” Show what happened. If it failed, explain what you changed.']},
 {heading:'Don’t hold the useful answer hostage.',paragraphs:['A “part two?” ending feels irritating when part one barely said anything. Give each video a complete little payoff. The next episode should add something, not release information you could have given in ten seconds.', 'Keep episode labels readable. Put the subject in the title rather than writing only “Part 3.” A stranger might meet your series in the middle.', 'Look at where viewers leave, what they ask, and whether the right enquiries arrive. Start with three episodes. A small, finished series can teach you something; a twelve-episode plan you never film cannot.']}
 ],takeaway:'Pick one process customers ask about. Write three questions it can answer, then film one answer per episode.',sources:[{title:'YouTube: Connect with creators on the biggest screen with YouTube’s latest features',url:'https://blog.youtube/news-and-events/made-on-youtube-creators-shorts-series-tv-features/',date:'23 September 2026'}]},
 {slug:'stop-answering-how-much-from-scratch',title:'“How much?” shouldn’t need a 14-message conversation.',category:'Business',summary:'Your customer isn’t asking for homework. Give them a useful answer—and ask for the details that actually change the price.',readTime:'4 min read',published:'2026-10-24',image:messages,sections:[
 {heading:'Customer: “How much?” Business: “Hello dear.” And so it begins.',paragraphs:['By message six, you’ve established that they want a cake. By message nine, you’ve discovered it’s for tomorrow. By message fourteen, somebody finally mentions the size.', 'This is an illustrative exchange, but the problem is familiar: the customer thinks they asked one question. You know there are three missing details. Neither of you wants to spend the afternoon in the chat.', 'The answer isn’t a paragraph explaining how busy you are. It’s a reply that moves the conversation forward without making the customer feel they’ve joined a queue at an office.']},
 {heading:'Answer something before asking everything.',paragraphs:['If you have a genuine fixed package, say what it costs and what it includes. “A six-inch cake starts at [your actual price], with buttercream and a simple inscription” is clearer than “prices vary.”', 'If the job needs a custom quote, explain which detail changes the price. “For printing, quantity and paper finish affect the total. What size and how many copies?” You’ve given the question a reason.', 'Don’t advertise a tiny starting price for a version of the service you never sell. It might win a click and lose the conversation.']},
 {heading:'Save this reply. Replace the brackets first.',paragraphs:['Keep the first request short enough to answer from a phone. Ask the important questions now; gather the rest after you know whether the work is a fit.'],template:'Thanks for reaching out! [Package] costs [real price] and includes [clear scope].\n\nTo confirm the right option, please send:\n• [The detail that affects the quote most]\n• [Quantity, size or required features]\n• [Deadline—and delivery area if relevant]\n\nI’ll confirm the total and timing before we book anything.'},
 {heading:'Your website can do the first two minutes of the chat.',paragraphs:['A clear service page shows examples, a meaningful price or pricing explanation, what’s included, and what to do next. A wall of “innovative solutions” answers none of those questions.', 'Read the last five genuine enquiries. Which question appeared more than once? Delivery areas, turnaround times and file requirements are often more useful than another decorative section.', 'Keep your saved reply and the page consistent. If one says two revisions and the other says unlimited, you’ve created tomorrow’s problem today.']},
 {heading:'The goal is a better chat, not no chat.',paragraphs:['Some people need reassurance before paying. Some jobs need discussion. A saved reply should make room for that, not send everyone a cold form and disappear.', 'Try it for your next five enquiries. If people keep missing one question, rewrite it. You don’t need a complicated system to notice where a conversation gets stuck.']}
 ],takeaway:'Save one clear reply today. Put the answer to your most repeated question on your service page tomorrow.'},
 {slug:'give-your-next-product-ad-one-job',title:'Your product ad has 8 transitions. Does it have a reason to buy?',category:'Content & ads',summary:'The edit is smooth. The viewer still doesn’t know what the product does. Fix that before you open CapCut.',readTime:'4 min read',published:'2026-10-24',image:phone,sections:[
 {heading:'We have all met this video.',paragraphs:['Logo spins. Bass drops. Product rotates. Another transition. “Elevate your lifestyle.” End.', 'It looks expensive. But what is it? Who is it for? Why would somebody choose it? The video has finished before those questions have entered the room.', 'A small ad budget doesn’t need to compete with a film studio. It does need to make one useful point. Before choosing a template, finish this sentence: “After watching, I want the viewer to understand…”']},
 {heading:'Pick the moment when the product becomes useful.',paragraphs:['A bag is a bag until the laptop, charger, bottle and notebook all fit without a wrestling match. A booking website is a screenshot until a customer can choose a time without sending seven messages.', 'Show that moment. Start close enough to the problem that someone recognises it. You can be funny, dramatic or quiet—the point still needs to be visible.', 'For a made-up example, a lunch flask ad could begin with sauce leaking into a work bag, then demonstrate the actual seal. Only claim leak resistance if your product supports it. A hook is not permission to invent proof.']},
 {heading:'A five-shot plan beats an empty timeline.',paragraphs:['Use this as a starting structure. Change it when the idea needs a different rhythm.'],bullets:['The situation: a recognisable inconvenience or desire.','The detail: the feature that matters here.','The demonstration: show what happens when someone uses it.','The evidence: an honest result, material detail or permitted customer feedback.','The next step: where to buy, enquire or see the options.']},
 {heading:'Write as though the customer is beside you.',paragraphs:['“Our innovative storage solution streamlines your daily journey” is a lot of work for “your charger has its own pocket.” Say the useful thing.', 'Read the script out loud. If you’d feel odd saying it to a customer, try again. Leave space for the image to explain something; the voiceover doesn’t have to narrate every movement.', 'If you use an AI actor or fictional demonstration, don’t dress it up as a genuine customer testimonial. The performance can be invented. The claim needs to be true.']},
 {heading:'Then open CapCut.',paragraphs:['Choose the sound, cuts and type. Give the key detail enough time to be understood. Watch once with the sound off. Can someone still tell what you’re selling?', 'For your next version, change one meaningful decision—perhaps the opening situation—and keep enough of the rest consistent to learn something. Changing the song, script, offer and product all at once won’t tell you which change mattered.']}
 ],takeaway:'Write the buying reason in one plain sentence. If the footage doesn’t show it, add that shot before adding another transition.'},
 {slug:'before-you-print-check-these-six-things',title:'The flyer is beautiful. The phone number is wrong.',category:'Design & print',summary:'A tiny mistake gets a lot less tiny after 500 copies. Six things to check before you send “approved.”',readTime:'4 min read',published:'2026-10-24',image:colour,sections:[
 {heading:'“Approved” is a short word for a very final decision.',paragraphs:['On a screen, a typo takes a minute to fix. On a stack of printed invitations, it becomes a much longer conversation.', 'A design can look completely finished while carrying the wrong venue, yesterday’s price or one missing digit. You’ve seen the layout so many times your eyes are reading what they expect.', 'Before approving, stop looking at it as a design. Read it as someone who needs to use the information.']},
 {heading:'1. Read the boring details out loud.',paragraphs:['Names. Date. Day of the week. Time. Venue. Phone number. Compare each with the original information. For a formal invitation, ask the people named to approve their spelling.', 'A beautiful typeface cannot rescue an event that apparently happens on Friday the wrong date. Check the calendar.']},
 {heading:'2. Scan it. Tap it. Call it.',paragraphs:['Test the QR code from another phone. Check that the website loads and the WhatsApp link reaches the right business.', 'Test at the intended printed size, ideally on a physical proof. Something that scans on a bright laptop screen may be harder to use on a small glossy card.']},
 {heading:'3. Agree what “A5, 500 copies” includes.',paragraphs:['Confirm finished size, quantity, paper, weight, sides, coating and folding or finishing. For packaging, confirm the dieline with the printer. “The usual one” is a surprisingly flexible specification.', 'Confirm who supplies the final print file. A screenshot sent through a messaging app is not automatically the same thing as the original artwork.']},
 {heading:'4. Give the cutter some room.',paragraphs:['Ask the printer for bleed, safe-area and export requirements. Keep important text away from the trim. Carry backgrounds to the required bleed area.', 'Products and suppliers can need different settings. Use the production specification for this job rather than a number you remember from another one.']},
 {heading:'5. Check colour and detail on something physical.',paragraphs:['Screens glow. Paper reflects. Fabric behaves differently again. If colour matters, ask about a physical proof or sample and agree which reference to use.', 'Look at small text and fine lines at actual size. Zooming to 400% makes almost anything look readable. Your customer won’t have that button on the printed bag.']},
 {heading:'6. Approve one file, not a group-chat atmosphere.',paragraphs:['Collect changes into one list. Ask for the final proof. Identify the exact filename or version you’re approving.', '“Yes, this one” can mean very different things when three versions and two voice notes have landed since the last message. Clear approval saves everyone from guessing.']}
 ],takeaway:'Check the final file on a second device and read every contact detail slowly. Then name the exact version you’re approving.'}
];
