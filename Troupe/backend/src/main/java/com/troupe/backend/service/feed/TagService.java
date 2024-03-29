package com.troupe.backend.service.feed;

import com.troupe.backend.domain.feed.Feed;
import com.troupe.backend.domain.feed.FeedTag;
import com.troupe.backend.domain.feed.Tag;
import com.troupe.backend.repository.feed.FeedTagRepository;
import com.troupe.backend.repository.feed.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    private final FeedTagRepository feedTagRepository;


    public void insert(List<Tag> tags, Feed feed){
//        System.out.println("tagListsize:  "+ tags.size());
        try {
            for(Tag tag: tags){
                Optional<Tag> tagInsert = tagRepository.findByName(tag.getName());
                if(tagInsert.isEmpty()){
                    Tag newTag = tagRepository.save(tag);
                    feedTagRepository.save(FeedTag.builder().tag(newTag).feed(feed).build());
                    continue;
                }else{
                    if(selectFeedTag(feed,tagInsert.get()) == null)
                        feedTagRepository.save(FeedTag.builder().tag(tagInsert.get()).feed(feed).build());
                }
            }
        }catch (Exception e){
            log.info(e.toString());
        }
    }
    public void deleteAll(Feed feed){
        try {
            List<FeedTag> feedTags = feedTagRepository.findAllByFeed(feed);
            for(FeedTag feedtag: feedTags)
                 feedTagRepository.delete(feedtag);
        }catch (Exception e){
            log.info(e.toString());
        }
    }
    public FeedTag selectFeedTag (Feed feed, Tag tag){
        return feedTagRepository.findByFeedAndTag(feed,tag);
    }

    public List<Tag> selectAll(Feed feed){
        List<FeedTag> feedTags = feedTagRepository.findAllByFeed(feed);
        List<Tag> list = new ArrayList<>();
        for(FeedTag feedTag: feedTags){
            list.add(feedTag.getTag());
        }
        return list;
    }

    // 중복 수정
    public List<FeedTag> selectAllBySearch(List<String> tags, Pageable pageable){
        int size = tags.size();
        List<FeedTag> feeds =feedTagRepository.findAllByTagsIn(tags,size,pageable);
        return feeds;
    }

    public Tag selectTag(String tagName){
        return tagRepository.findByName(tagName.trim()).get();
    }
}
