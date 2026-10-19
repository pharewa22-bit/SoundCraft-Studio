export interface AudioElementSample {
  sfxName: string;
  sfxType: 'jingle' | 'news' | 'whoosh' | 'censor' | 'applause' | 'phone' | 'door' | 'countdown';
  sfxDescription: string;
  bgmName: string;
  bgmType: 'upbeat' | 'dramatic' | 'lofi';
  bgmDescription: string;
  voScript: string;
  voDescription: string;
}

export interface KnowledgeCategory {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  tag: string;
  content: {
    overview: string;
    sections: {
      heading: string;
      details: string[];
      tableData?: { headers: string[]; rows: string[][] };
    }[];
    audioSample: AudioElementSample;
  };
}

export interface RadioTypeItem {
  id: number;
  name: string;
  englishName: string;
  description: string;
  keyFormat: string;
  soundElements: string;
  audioSample: AudioElementSample;
}

export interface AcademicReference {
  id: string;
  title: string;
  authorOrOrg: string;
  year: string;
  category: string;
  description: string;
  url?: string;
}

// 4 New Interactive Curriculum Modules
export const DETAILED_KNOWLEDGE_MODULES: KnowledgeCategory[] = [
  {
    id: 'diff-radio-podcast',
    title: '1) ความแตกต่างระหว่างวิทยุออนไลน์กับ Podcast',
    shortDesc: 'เปรียบเทียบเชิงลึกด้านการกระจายสัญญาณ พฤติกรรมการฟัง โครงสร้างเวลา และระบบสถิติ',
    iconName: 'RadioVsPodcast',
    tag: 'FOUNDATION',
    content: {
      overview:
        'แม้ทั้งวิทยุออนไลน์ (Internet Radio) และพอดแคสต์ (Podcast) จะเป็นสื่อเสียงดิจิทัล แต่มีธรรมชาติ โครงสร้างเวลา และพฤติกรรมผู้ฟังที่แตกต่างกันอย่างมีนัยสำคัญ วิทยุเน้นความสด ทันสถานการณ์ และการฟังร่วมกัน (Shared Experience) ขณะที่พอดแคสต์เน้นความเจาะลึก เฉพาะกลุ่ม และการเลือกฟังตามสะดวก (On-Demand Intimacy)',
      sections: [
        {
          heading: 'ตารางเปรียบเทียบ 7 มิติหลัก (Comparative Matrix)',
          details: [
            'วิทยุออนไลน์ส่งสัญญาณผ่าน Live Streaming Protocol (เช่น HLS, Icecast) ผู้ฟังรับฟังพร้อมกัน ณ เวลาจริง',
            'พอดแคสต์เผยแพร่ผ่าน RSS Feed ไปยังแอปพลิเคชัน (Apple Podcasts, Spotify) ผู้ฟังดาวน์โหลดหรือสตรีมย้อนหลังได้ตลอดเวลา',
            'ผู้ฟังวิทยุมักเปิดคลอระหว่างทำกิจกรรมอื่น (Passive/Companion Listening) ในขณะที่ผู้ฟังพอดแคสต์มีความตั้งใจฟังเนื้อหาสูง (Active/Intentional Listening)',
          ],
          tableData: {
            headers: ['มิติการเปรียบเทียบ', 'วิทยุออนไลน์ (Internet Radio)', 'พอดแคสต์ (Podcast)'],
            rows: [
              ['รูปแบบการออกอากาศ', 'ถ่ายทอดสดตามเวลาจริง (Linear Live Stream)', 'เลือกฟังตามสั่งย้อนหลัง (On-Demand Content)'],
              ['เทคโนโลยีการส่งสัญญาณ', 'Streaming Server (Icecast / Shoutcast / HLS)', 'RSS Feed XML เชื่อมโยงไฟล์ MP3/M4A'],
              ['โครงสร้างเวลา (Pacing)', 'ยึดผังเวลาเข้มงวด (Clock Format / Top of Hour)', 'ยืดหยุ่นตามเนื้อหา (No Fixed Duration)'],
              ['พฤติกรรมผู้ฟัง', 'ฟังคลอเป็นเพื่อนร่วมกิจกรรม (Passive Listening)', 'ตั้งใจฟังเจาะจงเฉพาะเรื่อง (Active Intent)'],
              ['การวัดผลสถิติ', 'Concurrent Listeners (ผู้ฟังสดพร้อมกัน), TSL', 'Downloads, Unique Devices, Retention Rate (IAB V2)'],
              ['การมีส่วนร่วมหน้าไมค์', 'เปิดสายสด Phone-In, SMS, แชตอ่านข้อความทันที', 'Comment ใต้ตอน, Community Discord, Q&A ท้ายสัปดาห์'],
              ['เกณฑ์ความดังเสียง (LUFS)', '-18 ถึง -23 LUFS (Broadcasting standard)', '-14 ถึง -16 LUFS (Streaming Platform standard)'],
            ],
          },
        },
        {
          heading: 'ข้อสรุปสำหรับผู้ผลิตสื่อยุคใหม่',
          details: [
            'สถานีวิทยุยึดจุดแข็งเรื่อง "ความสด สภาพจราจร ข่าวด่วน และความผูกพันของดีเจประจำช่วง"',
            'พอดแคสต์ยึดจุดแข็งเรื่อง "Evergreen Content ฟังซ้ำได้เสมอ การเล่าเรื่องแบบเจาะลึก และกลุ่มผู้ฟัง Niche ที่เหนียวแน่น"',
            'แนวทาง Hybrid ในปัจจุบัน: จัดรายการวิทยุสด แล้วนำช่วงไฮไลต์มาตัดต่อ (Repurpose) เป็นพอดแคสต์ให้ฟังย้อนหลัง',
          ],
        },
      ],
      audioSample: {
        sfxName: 'Station Sweeper & Jingle',
        sfxType: 'whoosh',
        sfxDescription: 'เสียงจิงเกิลและสวีปเปอร์สั้นๆ 1.5 วินาที ใช้เชื่อมเข้าสู่ช่วงรายการสด',
        bgmName: 'Lo-Fi Chill & Discussion Bed',
        bgmType: 'lofi',
        bgmDescription: 'ดนตรีสไตล์ Lo-Fi ฟังสบาย ช่วยพยุงการสนทนาในพอดแคสต์โดยไม่กลบเสียงพูด',
        voScript:
          'สวัสดีครับคุณผู้ฟัง นี่คือความแตกต่างระหว่างวิทยุสดกับพอดแคสต์ ที่ผู้สร้างสรรค์สื่อเสียงยุคดิจิทัลต้องเข้าใจเพื่อเลือกช่องทางสื่อสารให้ตรงกลุ่มเป้าหมายครับ',
        voDescription: 'เสียงพากย์นุ่มนวล เป็นมิตร ชัดถ้อยชัดคำ สไตล์การเปิดหัวพอดแคสต์',
      },
    },
  },
  {
    id: 'radio-9-types',
    title: '2) รูปแบบรายการวิทยุ 9 ประเภท (Format Typology)',
    shortDesc: 'เจาะลึกโครงสร้าง Talk, Magazine, สารคดี, ละครวิทยุ, ข่าว, เพลง, สปอต และเกมโชว์',
    iconName: 'RadioTypes',
    tag: 'FORMATS',
    content: {
      overview:
        'ในวิชานิเทศศาสตร์และการกระจายเสียง รายการวิทยุถูกจำแนกออกเป็น 9 รูปแบบหลัก แต่ละรูปแบบมีเอกลักษณ์ โครงสร้างบท การจัดวางสัดส่วนคำพูดต่อดนตรี (Speech-to-Music Ratio) และเทคนิคเสียงที่แตกต่างกันอย่างสิ้นเชิง',
      sections: [
        {
          heading: 'สำรวจรูปแบบรายการวิทยุ 9 ประเภทแบบเจาะลึก',
          details: [
            'คลิกเลือกดูรายละเอียดและฟังเสียงจำลองของแต่ละรูปแบบด้านล่าง',
            'สังเกตการผสมผสานระหว่าง SFX, BGM และน้ำเสียงผู้จัดรายการ (VO) ในแต่ละประเภท',
          ],
        },
      ],
      audioSample: {
        sfxName: 'Phone-in Call Ring',
        sfxType: 'phone',
        sfxDescription: 'เสียงกริ่งโทรศัพท์รับสายหน้าไมค์ สำหรับรายการสนทนาตอบปัญหา',
        bgmName: 'Upbeat Pop Music Bed',
        bgmType: 'upbeat',
        bgmDescription: 'ดนตรีจังหวะกระฉับกระเฉงสำหรับรายการเพลงและนิตยสารทางอากาศ',
        voScript:
          '102.5 SoundCraft Studio เปิดสายสดหน้าไมค์แล้วครับ มีสายจากผู้ฟังทางบ้าน โทรเข้ามาแชร์เรื่องราวในวันนี้กันครับ!',
        voDescription: 'เสียงดีเจร่าเริง สนุกสนาน ดึงดูดความสนใจ',
      },
    },
  },
  {
    id: 'jingle-spot-30s',
    title: '3) เทคนิคการผลิต Jingle และ Spot รณรงค์ความยาว 30 วินาที',
    shortDesc: 'สูตรโครงสร้างวินาทีต่อวินาที (0-5s Hook, 6-18s Core, 19-25s Impact, 26-30s CTA)',
    iconName: 'JingleSpot',
    tag: 'PRODUCTION',
    content: {
      overview:
        'สปอตวิทยุ 30 วินาทีเป็นศิลปะแห่งความกระชับ ทุกเสี้ยววินาทีมีมูลค่าสูง ผู้ฟังมีเวลาตัดสินใจว่าจะฟังต่อหรือเปลี่ยนคลื่นใน 5 วินาทีแรก การผสมผสาน Sound Effects (SFX), ดนตรีประกอบ (Music Bed) และเสียงพากย์ (Voiceover) ต้องถูกคำนวณจังหวะอย่างแม่นยำระดับเฟรมเสียง',
      sections: [
        {
          heading: 'โครงสร้างการเขียนสปอต 30 วินาที วินาทีต่อวินาที (0-30s Blueprint)',
          details: [
            '00 - 05 วินาที [THE HOOK]: ต้องมีเสียงเอฟเฟกต์กระตุกหู (Punch SFX) หรือคำถามที่ดึงดูดความสนใจทันที ห้ามเปิดด้วยคำทักทายเยิ่นเย้อ',
            '06 - 18 วินาที [PROBLEM & INSIGHT]: อธิบายปัญหาหรือสถานการณ์ที่ผู้ฟังประสบ เช่น สภาพอากาศ ปัญหาสุขภาพ หรือความเสี่ยง พร้อมดนตรี BGM ค่อยๆ ยกระดับ',
            '19 - 25 วินาที [THE SOLUTION]: เสนอทางออกหรือแนวทางรณรงค์ เช่น "แยกขยะเพื่อโลก" หรือ "ขับขี่ปลอดภัยสวมหมวกนิรภัย"',
            '26 - 30 วินาที [CALL TO ACTION & SLOGAN]: สโลแกนติดหู + ชื่อแคมเปญ/องค์กร พร้อมเสียงจิงเกิลส่งท้าย (Stinger Outro)',
          ],
          tableData: {
            headers: ['ช่วงเวลา', 'หน้าที่ของส่วนบท', 'องค์ประกอบเสียงที่ต้องมี', 'ตัวอย่างสปอตรณรงค์'],
            rows: [
              ['0-5s', 'หมัดฮุกดึงดูด (Attention Hook)', 'SFX เด่นชัด + คำเปิดกระแทกใจ', '[SFX เสียงเบรกเอี๊ยดดังลั่น!] "แค่วินาทีเดียว... ชีวิตอาจเปลี่ยน"'],
              ['6-18s', 'เนื้อหาใจความ (Core Message)', 'BGM จังหวะมั่นคง + เสียงพากย์จริงจัง', '"อุบัติเหตุบนท้องถนนป้องกันได้ เริ่มต้นที่วินัยการขับขี่"'],
              ['19-25s', 'ทางออก/คุณค่า (Action/Impact)', 'BGM ดังขึ้นเล็กน้อย + ประโยชน์ชัดเจน', '"สวมหมวกนิรภัย คาดเข็มขัด ไม่ขับเร็ว เพื่อคนที่รอคุณอยู่"'],
              ['26-30s', 'ตอกย้ำและช่องทาง (Slogan & CTA)', 'Jingle Stinger + สโลแกนจำง่าย', '"กลับถึงบ้านปลอดภัย ร่วมสร้างวินัยจราจร โดย สสส." [SFX Chime]'],
            ],
          },
        },
        {
          heading: 'เทคนิคการมิกซ์เสียงสปอต 3 ชิ้น (The 3 Audio Layers)',
          details: [
            'Layer 1: Voiceover (VO) - เป็นแกนหลัก ต้องตั้งระดับเสียงไว้ที่ -18 ถึง -14 dBFS ชัดเจนไม่โดนดนตรีกลบ',
            'Layer 2: Music Bed (BGM) - ดนตรีรองหลัง ต้องใช้เทคนิค Auto-Ducking ลดระดับเสียงลง -8 ถึง -12 dB ขณะมีเสียงพูด และยกขึ้นมาช่วงเปิด-ปิด',
            'Layer 3: Sound Effects (SFX) - ใส่เฉพาะจุดสำคัญเพื่อเน้นอารมณ์ ห้ามใส่พร่ำเพรื่อจนกลายเป็นเสียงรบกวน (Noise)',
          ],
        },
      ],
      audioSample: {
        sfxName: 'Brake Screech & Impact Punch',
        sfxType: 'censor',
        sfxDescription: 'เสียงเบรกและสัญญาณเตือน เพื่อกระตุกความสนใจในวินาทีที่ 0-3',
        bgmName: 'Urgent Dramatic Bed',
        bgmType: 'dramatic',
        bgmDescription: 'ดนตรีจังหวะเร้าอารมณ์เพื่อสร้างความตระหนักรู้ในสปอตรณรงค์',
        voScript:
          'แค่วินาทีเดียวที่คุณก้มดูมือถือ... อาจหมายถึงชีวิต! ขับขี่ปลอดภัย ไม่ใช้โทรศัพท์ขณะขับรถ ด้วยความปรารถนาดีจาก SoundCraft Studio',
        voDescription: 'เสียงพากย์กระชับ จริงจัง ทรงพลัง ชวนตระหนักคิด',
      },
    },
  },
  {
    id: 'principles-6t-3h',
    title: '4) หลักการจัดรายการ 6T 3H (Professional On-Air Framework)',
    shortDesc: 'หลักวิชาชีพนิเทศศาสตร์กระจายเสียง 6T (องค์ประกอบผลิต) และ 3H (สัมผัสหัวใจผู้ฟัง)',
    iconName: 'Framework6T3H',
    tag: 'PEDAGOGY',
    content: {
      overview:
        'หลักการ "6T 3H" เป็นทฤษฎีและแนวปฏิบัติคลาสสิกของวิชาชีพสื่อกระจายเสียงที่ใช้สอนในมหาวิทยาลัยและสถานีวิทยุชั้นนำ 6T คือมิติของการวางแผนการผลิต ส่วน 3H คือมิติของการส่งมอบคุณค่าทางอารมณ์และความรู้แก่ผู้ฟัง',
      sections: [
        {
          heading: 'แกนที่ 1: 6T (มิติการบริหารและการผลิตรายการ)',
          details: [
            '1. Time (เวลาที่ได้รับมอบหมาย): ตรงต่อเวลา คุมเวลาเบรกได้แม่นยำ ไม่ปล่อยให้เกิด Dead Air',
            '2. Timing (จังหวะจะโคน): รู้จังหวะการเว้นวรรคหายใจ (Pause), จังหวะเข้าเพลง (Talk-over intro), และจังหวะปิดเบรก',
            '3. Tone (น้ำเสียงและอารมณ์): ควบคุมระดับเสียง ความอบอุ่น ความสดใส ให้สอดคล้องกับช่วงเวลาของวันและธีมรายการ',
            '4. Topic (ประเด็นเนื้อหา): การเลือกหัวข้อที่ทันสถานการณ์ มีคุณค่า น่าสนใจ และผู้ฟังมีส่วนร่วมได้',
            '5. Technique (กลวิธีการสื่อสาร): ทักษะการตั้งคำถาม การเล่าเรื่องแบบ Storytelling การใช้เครื่องควบคุมเสียงและคิวดนตรี',
            '6. Target (กลุ่มผู้ฟังเป้าหมาย): เข้าใจเพศ วัย อาชีพ ไลฟ์สไตล์ เพื่อเลือกใช้ภาษาและระดับความเป็นกันเองที่เหมาะสม',
          ],
        },
        {
          heading: 'แกนที่ 2: 3H (มิติการสัมผัสจิตใจผู้ฟัง)',
          details: [
            '1. Head (สาระและสติปัญญา): ผู้ฟังต้องได้ข้อมูล ความจริง สาระที่เป็นประโยชน์ต่อการดำเนินชีวิต',
            '2. Heart (อารมณ์และความรู้สึก): ผู้ฟังเกิดความซาบซึ้ง ได้รับแรงบันดาลใจ หรือรู้สึกว่ามีเพื่อนคอยรับฟัง',
            '3. Humor (อารมณ์ขันและความเพลิดเพลิน): มีรอยยิ้ม ความผ่อนคลาย มุกตลกที่สุภาพและพอเหมาะ ไม่ทำให้เนื้อหาดูเครียดจนเกินไป',
          ],
          tableData: {
            headers: ['หลักการ', 'ความหมาย', 'ตัวอย่างการประยุกต์ใช้ในสตูดิโอจริง'],
            rows: [
              ['Time', 'การรักษาเวลา', 'พูดจบตรงจุดที่เพลงเริ่มท่อนร้อง (Hit the Post) พอดีเป๊ะ'],
              ['Timing', 'จังหวะจะโคน', 'เว้นวรรค 0.5 วินาทีหลังคำคมสำคัญ เพื่อให้ผู้ฟังคิดตาม'],
              ['Tone', 'น้ำเสียง', 'ช่วงเช้าใช้น้ำเสียงกระปรี้กระเปร่า ช่วงดึกใช้น้ำเสียงทุ้มนุ่มอบอุ่น'],
              ['Topic', 'ประเด็น', 'หยิบประเด็นฝุ่น PM2.5 มาคุยพร้อมแนะนำวิธีดูแลสุขภาพ'],
              ['Technique', 'กลวิธี', 'ใช้เสียง Sound Effect คั่นประเด็นแทนการพูดคำว่า "ต่อไป"'],
              ['Target', 'ผู้ฟังเป้าหมาย', 'รายการวัยรุ่นใช้ศัพท์ทันสมัย รายการผู้สูงอายุใช้ภาษาชัดเจนไม่พูดเร็ว'],
              ['Head', 'สมอง/ปัญญา', 'สอดแทรกเกร็ดประวัติศาสตร์ของบทเพลงที่เปิด'],
              ['Heart', 'หัวใจ/ความรู้สึก', 'เปิดสายให้กำลังใจผู้ฟังที่กำลังเผชิญปัญหาหมดไฟในการทำงาน'],
              ['Humor', 'อารมณ์ขัน', 'เล่าเรื่องขำขันในชีวิตประจำวันอย่างเป็นธรรมชาติ'],
            ],
          },
        },
      ],
      audioSample: {
        sfxName: 'Applause & Stinger',
        sfxType: 'applause',
        sfxDescription: 'เสียงปรบมือสร้างบรรยากาศแห่งความสุขและการให้กำลังใจ (Heart & Humor)',
        bgmName: 'Upbeat Radio Bed',
        bgmType: 'upbeat',
        bgmDescription: 'ดนตรีสไตล์โมเดิร์นคลอเบาๆ ช่วยคุมจังหวะ Timing ในการพูด',
        voScript:
          'จำไว้นะครับผู้ฟังทุกท่าน ไม่ว่าจะเหนื่อยแค่ไหน วันนี้คุณทำดีที่สุดแล้ว พักผ่อนให้เต็มที่ แล้วพรุ่งนี้มาลุยกันใหม่ เป็นกำลังใจให้เสมอครับ',
        voDescription: 'เสียงพากย์อบอุ่น จริงใจ สะท้อนหลัก Heart ได้อย่างลงตัว',
      },
    },
  },
];

// 9 Radio Formats
export const RADIO_9_FORMATS: RadioTypeItem[] = [
  {
    id: 1,
    name: 'รายการสนทนา / อภิปราย',
    englishName: 'Talk Show & Discussion',
    description: 'เน้นการแลกเปลี่ยนความคิดเห็นระหว่างผู้ดำเนินรายการกับแขกรับเชิญ หรือผู้ฟังทางบ้าน ในประเด็นสังคม เศรษฐกิจ หรือการเมือง',
    keyFormat: 'Speech 80% / Music 20%, มีการเตรียมประเด็นคำถามหลัก (Cue Sheet) และการคุมจังหวะเบรก',
    soundElements: 'ใช้ดนตรีไตเติลหนักแน่น น่าเชื่อถือ และ Stinger คั่นประเด็นสนทนา',
    audioSample: {
      sfxName: 'Discussion Topic Chime',
      sfxType: 'whoosh',
      sfxDescription: 'เสียงสัญญาณคั่นประเด็นสนทนา',
      bgmName: 'Lo-Fi Chill Bed',
      bgmType: 'lofi',
      bgmDescription: 'ดนตรีฟังสบายคลอเบื้องหลังการพูดคุย',
      voScript: 'ประเด็นสำคัญในชั่วโมงนี้ เราจะมาวิเคราะห์ผลกระทบของเทคโนโลยีเสียงกับผู้เชี่ยวชาญครับ',
      voDescription: 'น้ำเสียงสุขุม น่าเชื่อถือ เป็นกันเอง',
    },
  },
  {
    id: 2,
    name: 'รายการนิตยสารทางอากาศ',
    englishName: 'Magazine Program',
    description: 'รวมสาระหลากหลายคอลัมน์ไว้ในรายการเดียว เช่น สุขภาพ แฟชั่น ท่องเที่ยว เทคโนโลยี และเพลง โดยแบ่งเป็นช่วงสั้นๆ 5-10 นาที',
    keyFormat: 'Speech 60% / Music 40%, มีช่วงคอลัมน์ประจำชัดเจนและจิงเกิลประจำแต่ละคอลัมน์',
    soundElements: 'จิงเกิลเปลี่ยนช่วงสดใส สั้น กระชับ มี Sound Effect เสริมจินตนาการตามหัวข้อ',
    audioSample: {
      sfxName: 'Magazine Page Swell',
      sfxType: 'jingle',
      sfxDescription: 'เสียงจิงเกิลพลิกหน้าคอลัมน์',
      bgmName: 'Upbeat Pop Bed',
      bgmType: 'upbeat',
      bgmDescription: 'ดนตรีสดใส ทันสมัย ชวนติดตาม',
      voScript: 'มาถึงช่วง Lifestyle Guide วันนี้เราจะพาคุณผู้ฟังไปเช็คอินคาเฟ่รักษ์โลกใจกลางเมืองกันครับ',
      voDescription: 'น้ำเสียงสดใส กระตือรือร้น ทันสมัย',
    },
  },
  {
    id: 3,
    name: 'สารคดีเชิงเสียง',
    englishName: 'Audio Documentary / Feature',
    description: 'รายการสารคดีเสียงที่ค้นคว้าข้อเท็จจริงอย่างลึกซึ้ง ใช้การเล่าเรื่อง (Narration) ผสมเสียงบรรยากาศจริง (Natural Sound/Nat Sound) และบทสัมภาษณ์',
    keyFormat: 'โครงสร้างแบบ Story Arc: จุดเริ่มต้น ความขัดแย้ง และบทสรุปข้อคิด',
    soundElements: 'เน้นเสียงบรรยากาศสถานที่จริง (Ambience) และดนตรีประกอบที่ขับเคลื่อนอารมณ์',
    audioSample: {
      sfxName: 'Mystery Ambient Chime',
      sfxType: 'whoosh',
      sfxDescription: 'เสียงสะท้อนบอกเล่าความทรงจำ',
      bgmName: 'Dramatic Ambient Bed',
      bgmType: 'dramatic',
      bgmDescription: 'ดนตรีลุ่มลึก ชวนค้นหาความจริง',
      voScript: 'ย้อนกลับไปเมื่อ 50 ปีก่อน คลื่นวิทยุกระจายเสียงแห่งแรกได้เริ่มต้นส่งสัญญาณจากยอดตึกแห่งนี้...',
      voDescription: 'น้ำเสียงสุขุม นุ่มลึก มีมนต์สะกดและภาพจำลอง',
    },
  },
  {
    id: 4,
    name: 'ละครวิทยุ / ละครเสียง',
    englishName: 'Radio Drama / Audio Play',
    description: 'การถ่ายทอดเรื่องราวผ่านเสียงของนักแสดง ดนตรีสื่ออารมณ์ และเสียงประกอบ (Foley/SFX) ที่สมจริง เพื่อสร้าง "โรงละครในใจผู้ฟัง" (Theater of the Mind)',
    keyFormat: 'บทละครระบุคำพูดและคิวเสียงชัดเจน: [SFX เปิดประตู], [ดนตรีตื่นเต้น], [เสียงฝีเท้า]',
    soundElements: 'ต้องการ Sound Effects ที่แม่นยำระดับวินาที (Foley Sound) เช่น เสียงแก้วแตก เสียงลมพัด',
    audioSample: {
      sfxName: 'Creaking Door Sound',
      sfxType: 'door',
      sfxDescription: 'เสียงเปิดประตูเอี๊ยดอ๊าดในความมืด',
      bgmName: 'Dramatic Suspense Bed',
      bgmType: 'dramatic',
      bgmDescription: 'ดนตรีระทึกขวัญ สร้างความสงสัย',
      voScript: 'ใครน่ะ?! นั่นใครกำลังเดินอยู่ในเงามืดหลังประตูบานนั้น...',
      voDescription: 'เสียงหวาดระแวง ตื่นเต้น สั่นไหวตามบทละคร',
    },
  },
  {
    id: 5,
    name: 'รายการข่าวและรายงานสถานการณ์',
    englishName: 'News & Current Affairs',
    description: 'การรายงานข้อเท็จจริงตามหลัก 5W1H (Who, What, Where, When, Why, How) อย่างรวดเร็ว เที่ยงตรง เป็นกลาง และไม่มีอคติ',
    keyFormat: 'ข่าวต้นชั่วโมง 3-5 นาที หรือข่าวยาว 30 นาที แบ่งหมวดการเมือง เศรษฐกิจ สังคม กีฬา และอากาศ',
    soundElements: 'เสียงสัญญาณเวลา Top of the Hour และ Breaking News Stinger สร้างความเร่งด่วน',
    audioSample: {
      sfxName: 'Breaking News Fanfare',
      sfxType: 'news',
      sfxDescription: 'สัญญาณข่าวด่วนต้นชั่วโมง',
      bgmName: 'Upbeat News Ticker',
      bgmType: 'upbeat',
      bgmDescription: 'จังหวะกลองกระชับ ฉับไว เร่งเร้าความสนใจ',
      voScript: 'SoundCraft News ประจำเวลา 15 นาฬิกา สรุปสถานการณ์เศรษฐกิจและสภาพการจราจรช่วงบ่ายครับ',
      voDescription: 'น้ำเสียงน่าเชื่อถือ มั่นคง ชัดถ้อยชัดคำ',
    },
  },
  {
    id: 6,
    name: 'รายการเพลงและจัดอันดับเพลง',
    englishName: 'Music & Chart Countdown',
    description: 'รายการเปิดเพลงตามแนวทางของสถานี (Format) มีดีเจคอยแนะนำข้อมูลเพลง ประวัติศิลปิน และรายงานอันดับเพลงยอดนิยมประจำสัปดาห์',
    keyFormat: 'Music 75% / Speech 25%, ดีเจพูดเฉพาะช่วง Intro/Outro ของเพลง (Hit the Post)',
    soundElements: 'Music Sweeper, Station Jingle, เสียงแตร Airhorn และจังหวะดนตรีต่อเพลงที่ไร้รอยต่อ',
    audioSample: {
      sfxName: 'DJ Airhorn & Station ID',
      sfxType: 'jingle',
      sfxDescription: 'เสียงจิงเกิลคลื่นเพลงฮิต',
      bgmName: 'Upbeat Pop Bed',
      bgmType: 'upbeat',
      bgmDescription: 'ดนตรีแดนซ์จังหวะสนุกสนาน',
      voScript: 'และนี่คืออันดับ 1 ของ SoundCraft Top 40 สัปดาห์นี้ กับเพลงฮิตที่มียอดสตรีมสูงสุดครับ!',
      voDescription: 'เสียงดีเจร่าเริง มีพลัง และมีความสุข',
    },
  },
  {
    id: 7,
    name: 'รายการรับสายหน้าไมค์และคลินิกให้คำปรึกษา',
    englishName: 'Phone-in / Call-in Clinic',
    description: 'เปิดรับสายสดหรือข้อความจากผู้ฟัง เพื่อตอบปัญหาชีวิต กฎหมาย สุขภาพ หรือปัญหารถยนต์ โดยมีผู้เชี่ยวชาญร่วมให้คำแนะนำ',
    keyFormat: 'เน้นการฟังอย่างเข้าอกเข้าใจ (Active Listening) และระบบดีเลย์เสียง (Profanity Delay) 7 วินาที',
    soundElements: 'เสียงสัญญาณโทรศัพท์ เสียงแจ้งเตือนข้อความ SMS หน้าไมค์ ดนตรีเบาๆ ปลอบประโลม',
    audioSample: {
      sfxName: 'Phone Ringing Line 1',
      sfxType: 'phone',
      sfxDescription: 'เสียงต่อสายสัญญาณโทรศัพท์ผู้ฟัง',
      bgmName: 'Lo-Fi Chill Bed',
      bgmType: 'lofi',
      bgmDescription: 'ดนตรีนุ่มนวล สร้างบรรยากาศปลอดภัย',
      voScript: 'สวัสดีครับคุณสายแรก ขอต้อนรับสู่คลินิกใจ มีเรื่องอะไรไม่สบายใจ เล่าให้เราฟังได้เลยครับ',
      voDescription: 'น้ำเสียงอบอุ่น อ่อนโยน รับฟังอย่างจริงใจ',
    },
  },
  {
    id: 8,
    name: 'รายการเพื่อการศึกษาและการเรียนรู้',
    englishName: 'Educational & Edutainment',
    description: 'ถ่ายทอดความรู้ทางวิชาการ ภาษา วิทยาศาสตร์ หรือประวัติศาสตร์ ในรูปแบบที่เข้าใจง่าย สนุกสนาน และไม่น่าเบื่อ (Edutainment)',
    keyFormat: 'แบ่งเนื้อหาเป็นตอนสั้นๆ 15-20 นาที ใช้คำถามนำให้ผู้ฟังคิดตามก่อนเฉลย',
    soundElements: 'เสียง Sound Effect บอกถูก/ผิด เสียงกระดิ่ง และเสียงเพลงบรรเลงชวนสมาธิ',
    audioSample: {
      sfxName: 'Correct Answer Bell',
      sfxType: 'applause',
      sfxDescription: 'เสียงกระดิ่งความรู้ถูกต้อง',
      bgmName: 'Upbeat Pop Bed',
      bgmType: 'upbeat',
      bgmDescription: 'ดนตรีสดใส กระตุ้นจินตนาการการเรียนรู้',
      voScript: 'ทราบไหมครับว่าคลื่นเสียงเดินทางในน้ำได้เร็วกว่าในอากาศถึง 4 เท่า! เพราะอะไรนั้น ไปฟังกันครับ',
      voDescription: 'น้ำเสียงเป็นมิตร ชวนสงสัย มีชีวิตชีวา',
    },
  },
  {
    id: 9,
    name: 'รายการปกิณกะและเกมโชว์ทางวิทยุ',
    englishName: 'Variety & Radio Game Show',
    description: 'เน้นความบันเทิงเบาสมอง เกมทายเสียงปริศนา ทายชื่อเพลง หรือตอบคำถามชิงรางวัล สร้างการมีส่วนร่วมและความสนุกแก่ผู้ฟัง',
    keyFormat: 'จังหวะรายการรวดเร็ว กระฉับกระเฉง มีกติกาชัดเจน มีการนับเวลาถอยหลัง',
    soundElements: 'เสียงนับถอยหลัง 3-2-1, เสียงออดหมดเวลา, เสียงปรบมือเชียร์ และเสียงดีใจ',
    audioSample: {
      sfxName: 'Countdown 3-2-1 Beep',
      sfxType: 'countdown',
      sfxDescription: 'เสียงนับถอยหลังตอบคำถาม',
      bgmName: 'Upbeat Pop Bed',
      bgmType: 'upbeat',
      bgmDescription: 'ดนตรีเกมโชว์ตื่นเต้นเร้าใจ',
      voScript: 'เหลือเวลาอีก 5 วินาทีสุดท้ายครับ ตอบชื่อศิลปินท่านนี้ให้ได้... 3... 2... 1... หมดเวลา!',
      voDescription: 'น้ำเสียงตื่นเต้น ลุ้นระทึก สนุกสนาน',
    },
  },
];

// Academic References
export const ACADEMIC_REFERENCES: AcademicReference[] = [
  {
    id: 'ref-1',
    title: 'คู่มือและเกณฑ์มาตรฐานการประกอบกิจการกระจายเสียงวิทยุ',
    authorOrOrg: 'สำนักงาน กสทช. (NBTC Thailand)',
    year: '2565',
    category: 'กฎหมายและมาตรฐานวิชาชีพ',
    description: 'ข้อกำหนดทางเทคนิค การแพร่ภาพกระจายเสียง จรรยาบรรณวิชาชีพสื่อ และการจัดสรรคลื่นความถี่วิทยุกระจายเสียงในประเทศไทย',
    url: 'https://www.nbtc.go.th',
  },
  {
    id: 'ref-2',
    title: 'การผลิตรายการวิทยุกระจายเสียงและวิทยุดิจิทัล (Radio & Digital Audio Production)',
    authorOrOrg: 'คณะนิเทศศาสตร์ สถาบันการศึกษาชั้นนำ',
    year: '2566',
    category: 'ตำราวิชาการนิเทศศาสตร์',
    description: 'หลักการเขียนบท การใช้เสียงหน้าไมค์ โครงสร้าง 6T 3H เทคนิค Sound Design และการวางผังรายการ Clock Format',
  },
  {
    id: 'ref-3',
    title: 'EBU R128: Loudness normalisation and permitted maximum level of audio signals',
    authorOrOrg: 'European Broadcasting Union (EBU)',
    year: '2020',
    category: 'มาตรฐานวิศวกรรมเสียงสากล',
    description: 'มาตรฐานการวัดระดับความดังเสียง (LUFS) และการคุมค่า True Peak เพื่อป้องกันการแตกพร่าของสัญญาณเสียงบรอดคาสต์',
    url: 'https://tech.ebu.ch/loudness',
  },
  {
    id: 'ref-4',
    title: 'Spotify for Podcasters & Apple Podcasts Creator Guidelines',
    authorOrOrg: 'Spotify & Apple Inc.',
    year: '2024',
    category: 'มาตรฐานพอดแคสต์สตรีมมิ่ง',
    description: 'ข้อกำหนดทางเทคนิคไฟล์เสียง RSS Feed, มาตรฐานความดังเสียง -14 ถึง -16 LUFS, และการออกแบบภาพปกสตรีมมิ่ง',
  },
];

// Developer Contact Info
export const DEVELOPER_INFO = {
  name: 'SoundCraft Studio Development Team',
  leadDeveloper: 'วิยานนท์ (Viyanon P.) / SoundCraft Team',
  email: 'viyanon_p@silpakorn.edu',
  organization: 'มหาวิทยาลัยศิลปากร (Silpakorn University) • Digital Audio & Media Lab',
  purpose: 'เพื่อการศึกษา วิจัย และพัฒนาทักษะการผลิตสื่อกระจายเสียงยุคใหม่',
  version: 'SoundCraft Studio v3.0 (On-Air Interactive Edition)',
};

export interface ScriptTemplate {
  id: string;
  name: string;
  type: 'spot' | 'news' | 'podcast' | 'music_show';
  targetSeconds: number;
  description: string;
  suggestedTone: string;
  defaultContent: string;
}

export interface RundownItem {
  id: string;
  timeSlot: string;
  title: string;
  host: string;
  category: 'ข่าว' | 'เพลง' | 'สนทนา' | 'สปอต' | 'สาระความรู้';
  durationMinutes: number;
  cartId: string;
  status: 'on_air' | 'up_next' | 'queued' | 'completed';
  bitrate: string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'spot-30s',
    name: 'สปอตโฆษณารณรงค์ 30 วินาที (Eco Cafe)',
    type: 'spot',
    targetSeconds: 30,
    description: 'สูตร AIDA มาตรฐานวิทยุ ดนตรีสนุกสนาน กระตุ้นความสดชื่นด้วยเครื่องดื่มรักษ์โลก',
    suggestedTone: 'สดใส กระตือรือร้น ทันสมัย (Energetic & Fresh)',
    defaultContent: `[MUSIC BED: ดนตรีจังหวะ Acoustic Pop สดใส คลอเบาๆ]
[SFX: เสียงน้ำแข็งกระทบแก้ว + เสียงซ่าสดชื่น]

[DJ/HOST]: "บ่ายนี้ง่วงไหม? ชาร์จพลังความสดชื่นเต็มแก้วกับ GreenCraft Cold Brew กาแฟสกัดเย็นออร์แกนิก 100% หอมเข้ม กลมกล่อม ไม่เติมน้ำตาล!"

[SFX: เสียงกริ่งกระดิ่งคาเฟ่ ดริ๊งก์!]

[DJ/HOST]: "พิเศษ! พกแก้วมาเอง ลดทันที 10 บาททุกเมนู แวะเลยที่ GreenCraft ทุกสาขา เสิร์ฟความเฟรชถึงมือคุณ!"

[SFX: เสียงจิงเกิลประจำร้าน 2 วินาที]
[BED: Fade Out ปิดช่วง]`
  },
  {
    id: 'news-60s',
    name: 'ข่าวต้นชั่วโมง 60 วินาที (Breaking Flash)',
    type: 'news',
    targetSeconds: 60,
    description: 'จังหวะกระชับ ฉับไว ชัดถ้อยชัดคำ เน้นข้อมูลสำคัญ 5W1H สำหรับผู้ประกาศข่าวดิจิทัล',
    suggestedTone: 'น่าเชื่อถือ ชัดเจน มั่นคง มีพลัง (Authoritative & Crisp)',
    defaultContent: `[SFX: เสียงสัญญาณเวลา Top of the Hour ติ๊ด ติ๊ด ติ๊ด ตู๊ด!]
[SFX: Breaking News Fanfare Stinger]
[BED: ข่าวด่วน จังหวะอิเล็กโทรดรัมกระชับความเร็ว 120 BPM คลอระดับ -18dB]

[NEWS ANNOUNCER]: "SoundCraft Flash News ข่าวต้นชั่วโมง ประจำเวลา 14 นาฬิกา กับดิฉัน/กระผม [ชื่อผู้ประกาศ]

หัวข้อข่าวสำคัญวันนี้: กรมอุตุนิยมวิทยาประกาศเตือนมวลอากาศเย็นระลอกใหม่ปกคลุมทั่วภาคเหนือและอีสาน ส่งผลให้อุณหภูมิลดลง 2-4 องศาเซลเซียส ขณะที่กรุงเทพมหานครและปริมณฑล เช้านี้ดัชนีคุณภาพอากาศอยู่ในเกณฑ์ปานกลาง ประชาชนกลุ่มเสี่ยงควรสวมหน้ากากอนามัยเมื่อทำกิจกรรมกลางแจ้ง

ติดตามรายละเอียดข่าวเพิ่มเติมได้ที่เว็บไซต์ SoundCraftNews.com อัปเดตข่าวต้นชั่วโมงต่อไปเวลา 15 นาฬิกาตรง สวัสดีครับ"

[SFX: Outro Stinger ปิดข่าว]
[BED: Fade Out]`
  },
  {
    id: 'podcast-90s',
    name: 'พอดแคสต์เปิดตอน 90 วินาที (Tech Pulse Intro)',
    type: 'podcast',
    targetSeconds: 90,
    description: 'เปิดด้วย Cold Open ดึงดูดความสนใจ เข้าจิงเกิลรายการ และแนะนำธีมตอนอย่างอบอุ่น',
    suggestedTone: 'เป็นกันเอง อบอุ่น มีเสน่ห์ ชวนคิด (Conversational & Engaging)',
    defaultContent: `[COLD OPEN - VO]: "ถ้าวันหนึ่ง ปัญญาประดิษฐ์หรือ AI สามารถแต่งเพลงและจัดรายการวิทยุได้เนียนจนเราแยกไม่ออก... อาชีพของคนหลังไมค์จะเปลี่ยนไปในทิศทางไหน?"

[SFX: Whoosh Swell + Tech Glitch SFX]
[MUSIC: จิงเกิลรายการ Tech Pulse ประจำตอน ดนตรี Lo-Fi Synthwave 8 วินาที]

[HOST]: "สวัสดีครับคุณผู้ฟัง ยินดีต้อนรับเข้าสู่ Tech Pulse Podcast ประจำวันจันทร์ครับ อยู่กับผม ตะวัน อัศวเดช

สัปดาห์นี้ เราจะพาคุณผู้ฟังมาเกาะติดเบื้องหลังเทคโนโลยี Generative Audio และเครื่องมือจัดรายการในสตูดิโอยุคใหม่ ที่ไม่ได้มาเพื่อแทนที่มนุษย์ แต่มาเป็นผู้ช่วยคู่หูที่ทำให้การผลิตสื่อกระจายเสียงมีมิติและรวดเร็วกว่าที่เคย

เตรียมหูฟังของคุณให้พร้อม แล้วไปเปิดโลกเบื้องหลังเสียงกับเราในตอนนี้เลยครับ!"

[SFX: Chime Sweep]
[BED: ดนตรีบรรเลงท่อนเวิร์สเข้าสู่ช่วงสัมภาษณ์]`
  }
];

export const INITIAL_RUNDOWN: RundownItem[] = [
  {
    id: 'rd-1',
    timeSlot: '06:00 - 07:00',
    title: 'Morning Awakening & ข่าวเช้าทันสถานการณ์',
    host: 'ดีเจ กานต์ & กัญญารัตน์',
    category: 'ข่าว',
    durationMinutes: 60,
    cartId: 'CART-101',
    status: 'completed',
    bitrate: '320 kbps'
  },
  {
    id: 'rd-2',
    timeSlot: '07:00 - 09:30',
    title: 'Morning Drive & จราจรสดรอบเมืองหลวง',
    host: 'ดีเจ ตะวัน ประจำสตูดิโอ 1',
    category: 'สาระความรู้',
    durationMinutes: 150,
    cartId: 'CART-102',
    status: 'completed',
    bitrate: '320 kbps'
  },
  {
    id: 'rd-3',
    timeSlot: '09:30 - 11:30',
    title: 'SoundCraft Music Hits: เพลงฮิตติดกระแส',
    host: 'ดีเจ แพรรี่',
    category: 'เพลง',
    durationMinutes: 120,
    cartId: 'CART-103',
    status: 'on_air',
    bitrate: '320 kbps HD'
  },
  {
    id: 'rd-4',
    timeSlot: '11:30 - 12:00',
    title: 'สปอตประชาสัมพันธ์ & เสียงสะท้อนชุมชน',
    host: 'ฝ่ายผลิตสื่อกระจายเสียง',
    category: 'สปอต',
    durationMinutes: 30,
    cartId: 'CART-104',
    status: 'up_next',
    bitrate: '320 kbps'
  },
  {
    id: 'rd-5',
    timeSlot: '12:00 - 13:00',
    title: 'Midday News Flash & สรุปข่าวเศรษฐกิจเที่ยงวัน',
    host: 'ผู้ประกาศ ประวิทย์',
    category: 'ข่าว',
    durationMinutes: 60,
    cartId: 'CART-105',
    status: 'queued',
    bitrate: '320 kbps'
  },
  {
    id: 'rd-6',
    timeSlot: '13:00 - 15:30',
    title: 'Podcast Masterclass: ถอดรหัสเสียงสร้างสรรค์',
    host: 'ดีเจ อาร์ม & แขกรับเชิญ',
    category: 'สนทนา',
    durationMinutes: 150,
    cartId: 'CART-106',
    status: 'queued',
    bitrate: '320 kbps'
  }
];

export interface ScriptRow {
  id: string;
  cueTime: string;
  audioDetail: string;
  productionNote: string;
}

export interface StructuredScript {
  id: string;
  templateType: 'spot_30s' | 'travel_documentary' | 'storytelling_podcast';
  typeName: string;
  heading: {
    title: string;
    targetDuration: string;
    productionDate: string;
    stationOrPlatform: string;
    productionCode: string;
  };
  crew: {
    scriptwriter: string;
    producer: string;
    voiceTalent: string;
    soundEngineer: string;
  };
  contentRows: ScriptRow[];
  credit: {
    referenceSource: string;
    sponsorOrCopyright: string;
    signOffSlogan: string;
  };
}

export const AUTO_FILL_TEMPLATES: Record<string, StructuredScript> = {
  spot_30s: {
    id: 'spot-30s',
    templateType: 'spot_30s',
    typeName: '1) บทสปอตรณรงค์สังคม (Spot 30 วินาที)',
    heading: {
      title: 'สปอตรณรงค์: "ง่วงไม่ขับ พักก่อนสาย (Drive Awake, Arrive Safe)"',
      targetDuration: '30 วินาที',
      productionDate: '2026-10-19',
      stationOrPlatform: 'เครือข่ายวิทยุกระจายเสียง 102.5 SoundCraft FM / Social Audio',
      productionCode: 'SPOT-SAFE-2026-01',
    },
    crew: {
      scriptwriter: 'ทีมสร้างสรรค์สื่อสาธารณะเพื่อความปลอดภัย',
      producer: 'โปรดิวเซอร์ สตูดิโอ 1 (SoundCraft Production)',
      voiceTalent: 'ผู้ประกาศหญิง/ชาย น้ำเสียงจริงจัง มีน้ำหนักและชวนตระหนักรู้',
      soundEngineer: 'ฝ่ายเทคนิคเสียงบรอดคาสต์',
    },
    contentRows: [
      {
        id: 'row-1',
        cueTime: '00:00 - 00:05 (5s)',
        audioDetail: '[SFX: เสียงรถยนต์แล่นเร็ว ลมปะทะ + เสียงแถบชะลอความเร็ว ดังกึกๆๆ + เสียงหาวง่วงนอนหนักๆ]',
        productionNote: 'Fade In เร็ว ระดับ 0 dBFS / เสียงตัดเข้าทันทีเพื่อหยุดคนฟัง (Hook)',
      },
      {
        id: 'row-2',
        cueTime: '00:06 - 00:16 (10s)',
        audioDetail: '[DJ/VO]: "แค่แวบเดียวที่วูบหลับ... ความฝันของคนที่รอคุณอยู่ที่บ้าน อาจดับวูบลงไปตลอดกาล อุบัติเหตุจากการหลับในเกิดขึ้นได้ภายใน 3 วินาที"',
        productionNote: 'BGM Bed: ดนตรีจังหวะตึงเครียด กึ่งระทึกขวัญ Ducking ระดับ -12 dB ใต้เสียงพูด',
      },
      {
        id: 'row-3',
        cueTime: '00:17 - 00:24 (7s)',
        audioDetail: '[DJ/VO]: "ถ้ารู้สึกตาปรือ ล้างหน้า จิบน้ำ แวะจุดพักรถ 15 นาที หรือเปลี่ยนคนขับ อย่าฝืนขับเด็ดขาด"',
        productionNote: 'BGM ค่อยๆ คลายความตึงเครียด เป็นจังหวะเตือนสติอย่างอบอุ่น',
      },
      {
        id: 'row-4',
        cueTime: '00:25 - 00:30 (5s)',
        audioDetail: '[DJ/VO]: "ง่วงอย่าฝืน พักก่อนสาย ถึงบ้านปลอดภัยทุกคน"\n[SFX: SoundCraft Stinger Jingle]',
        productionNote: 'BGM Fade Out / SFX Stinger ดังคมชัด ปิดท้ายตรง 30.0 วินาทีพอดี',
      },
    ],
    credit: {
      referenceSource: 'สถิติความปลอดภัยทางถนน กรมการขนส่งทางบก และ สสส.',
      sponsorOrCopyright: 'โครงการรณรงค์เพื่อความปลอดภัยทางถนน โดย SoundCraft Studio',
      signOffSlogan: '"ง่วงไม่ขับ พักก่อนสาย ปลอดภัยทุกเส้นทาง"',
    },
  },

  travel_documentary: {
    id: 'travel-doc',
    templateType: 'travel_documentary',
    typeName: '2) บทรายการสารคดีท่องเที่ยว (Audio Travel Documentary)',
    heading: {
      title: 'สารคดีท่องเที่ยว: "เสน่ห์สายน้ำ เล่าขานวิถีอัมพวา (Whispers of Amphawa)"',
      targetDuration: '5 นาที (ตัดตอนสาธิต 90 วินาที)',
      productionDate: '2026-10-19',
      stationOrPlatform: 'รายการสารคดีเสียง SoundCraft Culture & Travel Series',
      productionCode: 'DOC-TRAVEL-AMP-04',
    },
    crew: {
      scriptwriter: 'นักเขียนสารคดีท่องเที่ยวเชิงวัฒนธรรม',
      producer: 'ฝ่ายผลิตรายการสารคดีพิเศษ',
      voiceTalent: 'ผู้บรรยายสารคดี (Narrator) น้ำเสียงนุ่มลึก อบอุ่น ชวนสัมผัสภาพ',
      soundEngineer: 'ซาวด์ดีไซเนอร์ระบบเสียงมิติเสมือน (Binaural & Ambience)',
    },
    contentRows: [
      {
        id: 'row-1',
        cueTime: '00:00 - 00:12 (12s)',
        audioDetail: '[NAT SOUND: เสียงพายกระทบผิวน้ำ จ๋อม... จ๋อม... + เสียงนกร้องยามเช้าตรู่]\n[BGM: เสียงขลุ่ยไทยและดนตรีอคูสติกเบาๆ ค่อยๆ ดังขึ้น]',
        productionNote: 'Fade In ช้าๆ (3 วินาที) สร้างบรรยากาศริมคลองยามเช้า',
      },
      {
        id: 'row-2',
        cueTime: '00:13 - 00:35 (22s)',
        audioDetail: '[NARRATOR]: "สายหมอกบางๆ ยังคงลอยอ้อยอิ่งเหนือผิวน้ำคลองอัมพวา เสียงไม้พายกระทบสายน้ำสม่ำเสมอ คือสัญญาณบอกเวลาของการเริ่มต้นวันใหม่ ที่นี่... วิถีชีวิตริมคลองไม่ได้ถูกกลืนหายไปกับกาลเวลา แต่ยังคงมีชีวิตในทุกจังหวะลมหายใจ"',
        productionNote: 'Ducking BGM -10 dB / ปล่อยเสียงพายเรือแผ่วๆ คลอทางสเตอริโอด้านซ้าย',
      },
      {
        id: 'row-3',
        cueTime: '00:36 - 00:55 (19s)',
        audioDetail: '[SFX: เสียงแม่ค้าทักทาย "พายเรือมาแต่เช้าเลยนะป้า วันนี้มีทองหยอดสดๆ จ้า"]\n[NARRATOR]: "เสียงทักทายอย่างคุ้นเคยของพ่อค้าแม่ขายในเรือพาย สะท้อนความอบอุ่นแบบไทยๆ ที่หาชมได้ยากในมหานคร"',
        productionNote: 'Crossfade เสียงสัมภาษณ์ชาวบ้านเข้าตรงกลาง แล้วสลับกลับสู่ผู้บรรยาย',
      },
      {
        id: 'row-4',
        cueTime: '00:56 - 01:20 (24s)',
        audioDetail: '[NARRATOR]: "เมื่อแสงตะวันส่องกระทบผิวน้ำ กลิ่นหอมของขนมไทยโบราณและกาแฟโบราณคั่วสดโชยมาตามลม ชวนให้เราก้าวช้าลง... และเปิดใจรับความสุขที่เรียบง่าย"\n[BGM: ดนตรีบรรเลงท่อนฮุกไพเราะ ค่อยๆ เร่งขึ้น]',
        productionNote: 'Swell BGM Up (3 วินาที) แล้ว Fade Out เข้าสู่ช่วงถัดไป',
      },
    ],
    credit: {
      referenceSource: 'การท่องเที่ยวแห่งประเทศไทย (ททท.) และกลุ่มอนุรักษ์วิถีคลองอัมพวา',
      sponsorOrCopyright: 'ลิขสิทธิ์บทรายการเพื่อการศึกษา SoundCraft Media Lab',
      signOffSlogan: '"เดินทางด้วยหู เปิดโลกด้วยเสียง กับสารคดีไทยร่วมสมัย"',
    },
  },

  storytelling_podcast: {
    id: 'story-pod',
    templateType: 'storytelling_podcast',
    typeName: '3) บทรายการพ็อดแคสต์เล่าเรื่อง (Narrative Storytelling Podcast)',
    heading: {
      title: 'พ็อดแคสต์: "Mindset Booster EP.12: ศิลปะของการเริ่มต้นใหม่ในวันที่ล้ม"',
      targetDuration: '3 นาที (ช่วงเปิด Intro & Hook)',
      productionDate: '2026-10-19',
      stationOrPlatform: 'Podcast Spotify, Apple Podcasts, SoundCraft RSS Channel',
      productionCode: 'POD-MIND-EP12',
    },
    crew: {
      scriptwriter: 'ผู้ดำเนินรายการพ็อดแคสต์ & ครีเอทีฟคอนเทนต์',
      producer: 'Executive Podcast Producer',
      voiceTalent: 'โฮสต์พ็อดแคสต์ (Host) สไตล์เหมือนคุยกับเพื่อนสนิท อบอุ่น มีมิติ',
      soundEngineer: 'Audio Mastering & LUFS Specialist (-14 LUFS Target)',
    },
    contentRows: [
      {
        id: 'row-1',
        cueTime: '00:00 - 00:15 (15s)',
        audioDetail: '[COLD OPEN - HOST VO]: "มีกี่ครั้งในชีวิตที่คุณรู้สึกว่า สิ่งที่ทุ่มเทมาทั้งหมด... มันพังทลายลงในพริบตาเดียว? และคำถามที่ยากที่สุดในตอนนั้นไม่ใช่ว่าทำไมเราถึงล้ม... แต่คือเราจะเอาแรงใจจากไหนเพื่อลุกขึ้นก้าวต่อไป?"',
        productionNote: 'Dry Voice (ไร้ดนตรี) เน้นความใกล้ชิด Intimacy / Room Tone เบาๆ',
      },
      {
        id: 'row-2',
        cueTime: '00:16 - 00:26 (10s)',
        audioDetail: '[SFX: Whoosh Swell + Sub Drop + Chime]\n[MUSIC: จิงเกิลประจำรายการ Mindset Booster สไตล์ Lo-Fi Neo-Soul 8 วินาที]',
        productionNote: 'Swell to Peak -1 dBFS แล้ว Fade Out ปล่อยให้ดนตรี Bed คลอเบาๆ',
      },
      {
        id: 'row-3',
        cueTime: '00:27 - 00:55 (28s)',
        audioDetail: '[HOST]: "สวัสดีครับคุณผู้ฟัง ยินดีต้อนรับเข้าสู่ Mindset Booster Podcast กับผม ตะวัน วันนี้ผมอยากชวนทุกคนมาคุยเรื่อง \'ความล้มเหลวที่สวยงาม\' ผ่านบันทึกของนักประดิษฐ์คนหนึ่งที่ถูกปฏิเสธมามากกว่า 1,000 ครั้ง"',
        productionNote: 'BGM Bed: ดนตรีเปียโน Lo-Fi คลอเบาๆ ระดับ -16 dB ใต้เสียงพูด',
      },
      {
        id: 'row-4',
        cueTime: '00:56 - 01:25 (29s)',
        audioDetail: '[HOST]: "ชงชาอุ่นๆ สักแก้ว หาที่นั่งสบายๆ แล้วปล่อยให้ 15 นาทีนี้ เป็นพื้นที่ปลอดภัยสำหรับการชาร์จพลังใจของคุณครับ... พร้อมแล้ว ไปฟังเรื่องราวแรกกันเลย"',
        productionNote: 'BGM มีเสียงบีทกลองเบาๆ เริ่มแทรกเข้ามา / Crossfade เข้าสู่เนื้อเรื่อง',
      },
    ],
    credit: {
      referenceSource: 'หนังสือ "The Psychology of Resilience" และบทสัมภาษณ์บุคคลต้นแบบ',
      sponsorOrCopyright: 'ผลิตและเผยแพร่โดย SoundCraft Podcast Network',
      signOffSlogan: '"เพราะทุกการล้มเหลว คือก้าวแรกของความสำเร็จครั้งใหม่"',
    },
  },
};


